"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/app/dashboard/_components/Button";
import { Pool } from "@/payload-types";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Address, formatUnits, isAddress, parseUnits } from "viem";
import {
  BondingPoolABI,
  BondingPoolFactoryABI,
  calculateStakeReward,
  useAllowance,
  useBalance,
  DEFAULT_ADMIN_ROLE,
  FACTORIES,
  displayBalance,
} from "@/web3";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";
import { TokenApproveButton } from "@/app/(frontend)/_components/TokenApproveButton";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const IncreaseSaleCap = ({
  pool,
  txSent,
}: {
  pool: Pool;
  txSent?: () => void;
}) => {
  const { address: account, chainId, isConnected } = useAccount();
  const { saleToken } = pool;
  const factory = useMemo(() => FACTORIES[pool.chainId], [pool.chainId]);

  // --- form validate
  const schema = z.object({
    saleCap: z
      .int("Please enter an integer")
      .gt(0, { message: "Please enter a valid integer" }),
  });
  const {
    register,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      saleCap: 1000,
    },
  });
  const saleCap = watch("saleCap");
  const [totalRequired, setTotalRequired] = useState("0");
  useEffect(() => {
    if (Number(saleCap) > 0) {
      setTotalRequired(
        BigNumber(saleCap)
          .plus(calculateStakeReward(saleCap, pool.apr, pool.lockDuration))
          .toFixed(pool.saleToken.decimals, 1),
      );
    } else {
      setTotalRequired("0");
    }
  }, [saleCap]);

  // --- check:
  const { data: hasRole } = useReadContract({
    chainId: pool.chainId,
    address: pool.address as Address,
    abi: BondingPoolABI,
    functionName: "hasRole",
    args: [DEFAULT_ADMIN_ROLE, account as Address],
    query: {
      enabled: !!account && !!pool.address && isAddress(pool.address),
    },
  });
  const { data: sBalance, refetch: refetchSBalance } = useBalance({
    chainId: pool.chainId,
    token: saleToken.address as Address,
    unit: saleToken.decimals,
    address: account,
    // watch: true,
    query: {
      enabled:
        !!account && !!saleToken?.address && isAddress(saleToken.address),
    },
  });
  const balanceIsSufficient = useMemo(() => {
    if (
      account &&
      sBalance &&
      Number(sBalance.formatted) > 0 &&
      Number(totalRequired) > 0
    ) {
      // console.log("_balance", sBalance.formatted);
      return Number(sBalance.formatted) >= Number(totalRequired);
    }
    return false;
  }, [account, sBalance, totalRequired]);

  const { data: sRawAllowance, refetch: refetchSAllowance } = useAllowance(
    pool.chainId,
    saleToken,
    account,
    factory.address,
  );
  const [sAllowance, allowanceIsSufficient] = useMemo(() => {
    if (account && sRawAllowance) {
      const _allowance = formatUnits(sRawAllowance, saleToken.decimals);
      // console.log("_allowance", _allowance);
      return [_allowance, Number(_allowance) >= Number(totalRequired)];
    }
    return ["0", false];
  }, [account, sRawAllowance, totalRequired]);

  // send transaction
  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
    error: writeError,
  } = useWriteContract();
  const { status: txWaitStatus, error: waitError } =
    useWaitForTransactionReceipt({
      chainId: pool.chainId,
      hash: txHash,
      query: { enabled: "success" === txWriteStatus },
    });
  useEffect(() => {
    console.log(`increasePoolCap.tx.status`, {
      txWriteStatus,
      txWaitStatus,
      writeError,
      waitError,
    });
    if (
      "success" === txWriteStatus &&
      ["success", "error"].includes(txWaitStatus)
    ) {
      setIsTxPending(false);
      if ("success" === txWaitStatus) {
        refetchSAllowance?.();
        refetchSBalance?.();
      }
    }
  }, [txWriteStatus, txWaitStatus, writeError, waitError]);
  const sendTransaction = () => {
    if (isTxPending) return;
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }
    if (chainId !== pool.chainId) {
      toast.error(`Please switch to ${pool.network}`);
      return;
    }
    if (!hasRole) {
      toast.error(`Account is not ADMIN`);
      return;
    }
    if (!balanceIsSufficient) {
      toast.error(`Insufficient balance`);
      return;
    }
    if (!(Number(saleCap) > 0)) {
      toast.error(`Please enter cap`);
      return;
    }

    setIsTxPending(true);
    writeContractAsync({
      account,
      address: factory.address as Address,
      abi: BondingPoolFactoryABI,
      functionName: "increasePoolCap",
      args: [
        pool.address as Address,
        parseUnits(String(saleCap), saleToken.decimals),
      ],
    })
      .then((hash) => {
        txSent?.();
        console.log(`increasePoolCap.tx.hash`, hash);
        toast.success(
          "Transaction successfully sent, please refresh the page later!",
          { duration: 30_000 },
        );
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error(`increasePoolCap.tx.err`, e);
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex border border-s-stroke2 rounded-full">
        <input
          id="increase-cap"
          type="number"
          placeholder="100"
          className={`w-32 h-12 pl-4.5 pr-2 text-body-2 text-t-primary outline-none transition-colors hover:border-s-highlight focus:border-s-highlight placeholder:text-t-secondary/50`}
          {...register("saleCap", { valueAsNumber: true })}
        />
        <label
          htmlFor="increase-cap"
          className="flex justify-center items-center px-2 bg-[#eee] border-x border-s-stroke2"
        >
          {saleToken.symbol}
        </label>
        {allowanceIsSufficient || !hasRole || errors?.saleCap?.message ? (
          <Button
            type="button"
            isStroke
            className={`border-none gap-2 pl-2 rounded-e-full ${isTxPending ? "!cursor-not-allowed" : ""}`}
            disabled={
              !hasRole ||
              !balanceIsSufficient ||
              !allowanceIsSufficient ||
              !!errors?.saleCap?.message
            }
            onClick={(e) => {
              e.stopPropagation();
              sendTransaction();
            }}
          >
            Increase Cap
            {isTxPending && <MoonLoader size={20} color="#727272" />}
          </Button>
        ) : (
          <TokenApproveButton
            token={saleToken}
            spender={factory.address!}
            amount={totalRequired}
            onSuccess={() => {
              console.log(
                dayjs().format("mm:ss SSS"),
                "approve.success, to refetch allowance",
              );
              refetchSAllowance?.();
            }}
            buttonClass="inline-flex items-center justify-center h-12 border rounded-3xl text-button transition-all cursor-pointer disabled:pointer-events-none fill-t-secondary text-t-secondary hover:text-t-primary hover:fill-t-primary disabled:border-transparent border-none gap-2 pr-6.5 pl-2 rounded-e-full"
          />
        )}
      </div>
      {false === hasRole ? (
        <div className="text-xs text-red-500">Account is not ADMIN</div>
      ) : errors?.saleCap?.message ? (
        <div className="text-xs text-red-500">{errors.saleCap.message}</div>
      ) : sBalance && !balanceIsSufficient ? (
        <div className="text-xs text-red-500">Insufficient balance</div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-1 mt-2 font-normal">
        <p className="flex justify-between">
          <span>Your Balance:</span>
          <span>
            {displayBalance(sBalance?.formatted ?? "0")} {pool.saleToken.symbol}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Your Allowance:</span>
          <span>
            {displayBalance(sAllowance)} {pool.saleToken.symbol}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Total Required:</span>
          <span>
            {displayBalance(totalRequired)} {pool.saleToken.symbol}
          </span>
        </p>
      </div>
    </div>
  );
};

export default IncreaseSaleCap;
