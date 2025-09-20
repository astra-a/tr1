"use client";

import Layout from "@/app/dashboard/_components/Layout";
import Button from "@/app/dashboard/_components/Button";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "@/app/dashboard/_components/Card";
import InputField from "@/app/dashboard/_components/Fields/Input";
import SelectField from "@/app/dashboard/_components/Fields/Select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { useMutation } from "@tanstack/react-query";
import Field from "@/app/dashboard/_components/Field";
import {
  useAccount,
  useChains,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  Address,
  Chain,
  encodePacked,
  formatUnits,
  isAddress,
  parseUnits,
} from "viem";
import { DAY_SECONDS } from "@/constants";
import {
  BondingPoolFactoryABI,
  calculateStakeReward,
  IFactory,
  useAllowance,
  useBalance,
  FACTORIES,
  TEAM_CODES,
} from "@/web3";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BigNumber from "bignumber.js";
import { MoonLoader } from "react-spinners";
import { Pool } from "@/payload-types";
import FactoryInfo from "./FactoryInfo";
import BalanceInfo from "./BalanceInfo";
import { TokenApproveButton } from "@/app/(frontend)/_components/TokenApproveButton";
import dayjs from "dayjs";

const checkNumberString = (val: string): boolean => {
  if (!/^\d+(\.\d+)?$/.test(val)) return false;
  return parseFloat(val) > 0;
};

const PoolForm = () => {
  const router = useRouter();
  const { address: account, chain: connectedChain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const chains = useChains();
  const chainOptions = useMemo(
    () => chains.map((c) => ({ id: c.id.toString(), name: c.name })),
    [chains],
  );
  const teamOptions = useMemo(
    () => TEAM_CODES.map((t) => ({ id: t, name: t })),
    [],
  );

  const [selectedChain, setSelectChain] = useState<Chain>(chains[0]);
  const [factory, setFactory] = useState<IFactory>(FACTORIES[selectedChain.id]);
  useEffect(
    () => console.log("selected", { chain: selectedChain, factory }),
    [selectedChain, factory],
  );

  // --- check
  const [totalRequired, setTotalRequired] = useState("0"); // saftToken
  const { data: sBalance } = useBalance({
    chainId: connectedChain?.id,
    token: factory.saleToken.address as Address,
    unit: factory.saleToken.decimals,
    address: account,
    // watch: true,
    query: {
      enabled:
        !!account &&
        !!factory.saleToken?.address &&
        isAddress(factory.saleToken.address),
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
    connectedChain?.id,
    factory.saleToken,
    account,
    factory.address,
  );
  const [sAllowance, allowanceIsSufficient] = useMemo(() => {
    if (account && sRawAllowance) {
      const _allowance = formatUnits(sRawAllowance, factory.saleToken.decimals);
      // console.log("_allowance", _allowance);
      return [_allowance, Number(_allowance) >= Number(totalRequired)];
    }
    return ["0", false];
  }, [account, sRawAllowance, totalRequired]);

  // --- send transaction
  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
    error: writeError,
    reset,
  } = useWriteContract();
  const { status: txWaitStatus, error: waitError } =
    useWaitForTransactionReceipt({
      chainId: selectedChain.id,
      hash: txHash,
      query: { enabled: "success" === txWriteStatus },
    });
  useEffect(() => {
    console.log("createPool.tx.status", {
      txHash,
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
    }
  }, [txHash, txWriteStatus, txWaitStatus, writeError, waitError]);

  const sendTransaction = (
    data: Pick<
      Pool,
      | "chainId"
      | "network"
      | "name"
      | "team"
      | "treasury"
      | "paymentRules"
      | "saleToken"
      | "apr"
      | "saleStartedAt"
      | "saleDuration"
      | "lockDuration"
      | "totalSaleCap"
    >,
    rules: {
      paymentTokens: Address[];
      prices: bigint[];
      mins: bigint[];
      maxs: bigint[];
    },
  ) => {
    setIsTxPending(true);
    writeContractAsync({
      account,
      address: factory.address as Address,
      abi: BondingPoolFactoryABI,
      functionName: "createPool",
      args: [
        data.name,
        encodePacked(["string"], [data.team]),
        BigInt(data.apr),
        BigInt(data.lockDuration),
        parseUnits(data.totalSaleCap, factory.saleToken.decimals),
        BigInt(data.saleDuration),
        BigInt(data.saleStartedAt),
        rules,
      ],
    })
      .then(async (hash) => {
        console.log("createPool.tx.hash", hash);
        toast.success("Transaction successfully sent!");
        sendCreatePool({
          ...data,
          creator: account!,
          createdHash: hash,
        }).finally(() => setIsTxPending(false));
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error("createPool.tx.err", e);
      });
  };

  // --- mutation:
  const createPoolMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(ROUTES.pools_new_action, data);
    },
  });
  const sendCreatePool = async (
    data: Pick<
      Pool,
      | "chainId"
      | "network"
      | "name"
      | "team"
      | "treasury"
      | "paymentRules"
      | "saleToken"
      | "apr"
      | "saleStartedAt"
      | "saleDuration"
      | "lockDuration"
      | "totalSaleCap"
      | "creator"
      | "createdHash"
    >,
  ) => {
    try {
      const resp = await createPoolMutation.mutateAsync(data);
      console.log("createPoolMutation.resp", resp);
      toast.success(resp.message);
      reset?.();
      router.push(ROUTES.pools_details(resp.data.id));
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  // --- form validate
  const schema = z.object({
    chainId: z.int().min(1, { message: "Please select a chain" }),
    network: z.string(),
    name: z.string().min(1, { message: "Please enter a name" }),
    team: z.string().min(1, { message: "Please select a team" }),
    apr: z
      .int("Please enter an integer")
      .gt(0, { message: "Please enter an integer between 0 and 100." })
      .lte(100, { message: "Please enter an integer between 0 and 100." }),
    lockDuration: z
      .int("Please enter an integer")
      .gt(0, { message: "Please enter a valid integer" }),
    saleDuration: z
      .int("Please enter an integer")
      .gt(0, { message: "Please enter a valid integer" }),
    saleStartedAt: z.iso.datetime({
      offset: true,
      message: "Please enter a datetime",
    }),
    totalSaleCap: z
      .int("Please enter an integer")
      .gt(0, { message: "Please enter a valid integer" }),
    paymentRules: z.array(
      z.object({
        paymentToken: z.object({
          address: z.string(),
          name: z.nullish(z.string()),
          symbol: z.string(),
          decimals: z.int(),
        }),
        price: z
          .string()
          .refine(checkNumberString, "Please enter a valid number"),
        minPurchase: z
          .string()
          .refine(checkNumberString, "Please enter a valid number"),
        maxPurchase: z
          .string()
          .refine(checkNumberString, "Please enter a valid number"),
      }),
    ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      chainId: selectedChain.id,
      network: selectedChain.name,
      name: "",
      team: teamOptions[0].name,
      apr: 10,
      lockDuration: 30,
      saleDuration: 90,
      saleStartedAt: "",
      totalSaleCap: 10000,
      paymentRules: factory.paymentTokens.map((t) => ({
        paymentToken: t,
        price: "0.1",
        minPurchase: "0.1",
        maxPurchase: "100",
      })),
    },
  });
  const onSubmit = async (data: {
    chainId: number;
    network: string;
    name: string;
    team: string;
    apr: number;
    lockDuration: number;
    saleDuration: number;
    saleStartedAt: string;
    totalSaleCap: number;
    paymentRules: {
      paymentToken: {
        address: string;
        name?: string | null;
        symbol: string;
        decimals: number;
      };
      price: string;
      minPurchase: string;
      maxPurchase: string;
    }[];
  }) => {
    if (isTxPending) return;
    console.log("onSubmit.data", data);
    if (!isConnected) {
      toast.error("Please connect wallet!");
      return;
    } else if (connectedChain?.id !== selectedChain.id) {
      toast.error(`Please switch to ${selectedChain.name}!`);
      return;
    }

    const paymentRules: {
      index: number;
      paymentToken: {
        address: string;
        name?: string | null;
        symbol: string;
        decimals: number;
      };
      price: string;
      minPurchase: string;
      maxPurchase: string;
      enabled: boolean;
    }[] = [];
    const paymentTokens: Address[] = [];
    const prices: bigint[] = [];
    const mins: bigint[] = [];
    const maxs: bigint[] = [];
    data.paymentRules.find((rule, index) => {
      const paymentRule = {
        index,
        paymentToken: rule.paymentToken,
        price: BigNumber(BigNumber(rule.price).toFixed(18, 1)).toString(),
        minPurchase: BigNumber(
          BigNumber(rule.minPurchase).toFixed(rule.paymentToken.decimals, 1),
        ).toString(),
        maxPurchase: BigNumber(
          BigNumber(rule.maxPurchase).toFixed(rule.paymentToken.decimals, 1),
        ).toString(),
        enabled: true,
      };
      paymentRules.push(paymentRule);
      paymentTokens.push(rule.paymentToken.address as Address);
      prices.push(parseUnits(paymentRule.price, 18));
      mins.push(
        parseUnits(paymentRule.minPurchase, rule.paymentToken.decimals),
      );
      maxs.push(
        parseUnits(paymentRule.maxPurchase, rule.paymentToken.decimals),
      );
    });

    const postData = {
      chainId: data.chainId,
      network: data.network,
      name: data.name,
      team: data.team,
      treasury: factory.treasury,
      paymentRules,
      saleToken: factory.saleToken,
      apr: data.apr * 100,
      saleStartedAt: dayjs(data.saleStartedAt).unix(),
      saleDuration: data.saleDuration * DAY_SECONDS,
      lockDuration: data.lockDuration * DAY_SECONDS,
      totalSaleCap: BigNumber(
        BigNumber(data.totalSaleCap).toFixed(factory.saleToken.decimals, 1),
      ).toString(),
    };
    console.log("postData", postData);
    console.log("send tx data:", [
      postData.name,
      // postData.team,
      encodePacked(["string"], [postData.team]),
      BigInt(postData.apr),
      BigInt(postData.lockDuration),
      parseUnits(postData.totalSaleCap, factory.saleToken.decimals),
      BigInt(postData.saleDuration),
      BigInt(postData.saleStartedAt),
      { paymentTokens, prices, mins, maxs },
    ]);

    if (txHash) {
      sendCreatePool({
        ...postData,
        creator: account!,
        createdHash: txHash,
      }).finally(() => undefined);
    } else {
      sendTransaction(postData, { paymentTokens, prices, mins, maxs });
    }
  };

  const [apr, lockDuration, totalSaleCap] = watch([
    "apr",
    "lockDuration",
    "totalSaleCap",
  ]);
  useEffect(() => {
    // console.log("onSubmit.111", { apr, lockDuration, totalSaleCap });
    if (apr > 0 && lockDuration > 0 && totalSaleCap > 0) {
      setTotalRequired(
        BigNumber(totalSaleCap)
          .plus(
            calculateStakeReward(
              totalSaleCap,
              apr * 100,
              lockDuration * DAY_SECONDS,
            ),
          )
          .toFixed(factory.saleToken.decimals, 1),
      );
    } else {
      setTotalRequired("0");
    }
  }, [apr, lockDuration, totalSaleCap]);
  // useEffect(() => console.log("totalRequired", totalRequired), [totalRequired]);

  return (
    <Layout title="New Pool" customHeaderActions={<></>}>
      <form id="pool-form" method="post" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-lg:block">
          <div className="w-[calc(100%-33.75rem)] pr-3 max-4xl:w-[calc(100%-27.5rem)] max-2xl:w-[calc(100%-23rem)] max-lg:w-full max-lg:pr-0">
            <Card title="Pool Details">
              <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <SelectField
                  label="Network"
                  placeholder="Select a network"
                  options={chainOptions}
                  value={{
                    id: getValues("chainId").toString(),
                    name: getValues("network"),
                  }}
                  onChange={(val) => {
                    if (val) {
                      setValue("chainId", Number(val.id));
                      setValue("network", val.name);
                      const chain = chains.find((c) => c.id === Number(val.id));
                      if (chain) {
                        switchChain({ chainId: chain.id });
                        setSelectChain(chain);
                        setFactory(FACTORIES[chain.id]);
                        setValue(
                          "paymentRules",
                          FACTORIES[chain.id].paymentTokens.map((t) => ({
                            paymentToken: t,
                            price: "0.1",
                            minPurchase: "0.1",
                            maxPurchase: "100",
                          })),
                        );
                      } else {
                        toast.error("Network is not available!");
                      }
                    } else {
                      toast.error("Network is required!");
                    }
                  }}
                  errorMessage={errors?.chainId?.message}
                />
                <InputField
                  label="Pool Name"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="ie. Pool Name"
                  {...register("name")}
                  errorMessage={errors?.name?.message}
                />
                {/*<SelectField*/}
                {/*  label="Team Code"*/}
                {/*  placeholder="Select a team code"*/}
                {/*  options={teamOptions}*/}
                {/*  value={{*/}
                {/*    id: getValues("team"),*/}
                {/*    name: getValues("team"),*/}
                {/*  }}*/}
                {/*  onChange={(val) => {*/}
                {/*    if (val) {*/}
                {/*      setValue("team", val?.name ?? "");*/}
                {/*    } else {*/}
                {/*      toast.error("Team Code is required!");*/}
                {/*    }*/}
                {/*  }}*/}
                {/*  errorMessage={errors?.team?.message}*/}
                {/*/>*/}
                <Field
                  label="APR"
                  placeholder="10"
                  type="number"
                  {...register("apr", { valueAsNumber: true })}
                  errorMessage={errors?.apr?.message}
                  suffix="%"
                />
                <Field
                  label="Lock Duration"
                  placeholder="30"
                  type="number"
                  {...register("lockDuration", { valueAsNumber: true })}
                  errorMessage={errors?.lockDuration?.message}
                  suffix="Days"
                />
                <Field
                  label="Sale Duration"
                  placeholder="90"
                  type="number"
                  {...register("saleDuration", { valueAsNumber: true })}
                  errorMessage={errors?.saleDuration?.message}
                  suffix="Days"
                />
                <Field
                  label="Sale Started At"
                  type="datetime-local"
                  {...register("saleStartedAt", {
                    setValueAs: (v) => `${v}:00${dayjs().format("Z")}`,
                  })}
                  errorMessage={errors?.saleStartedAt?.message}
                />
                <Field
                  label="Total Sale Cap"
                  placeholder="1000"
                  type="number"
                  // tooltip={`The cap of SaleToken, decimals: ${factory.saleToken.decimals}`}
                  {...register("totalSaleCap", { valueAsNumber: true })}
                  errorMessage={errors?.totalSaleCap?.message}
                  suffix={factory.saleToken.symbol}
                />
              </div>
            </Card>
            <Card title="Payment Rules">
              <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                {factory.paymentTokens.map((token, index) => (
                  <div key={token.address} className="flex flex-col gap-4">
                    <div className="text-base font-semibold">
                      Rule {index + 1}:
                    </div>
                    <div className="flex flex-col gap-4 pl-4">
                      <SelectField
                        label="Payment Token"
                        placeholder="Select a token"
                        options={[{ id: token.address, name: token.symbol }]}
                        value={{ id: token.address, name: token.symbol }}
                        onChange={() => undefined}
                        disabled
                      />
                      <Field
                        label="Price"
                        placeholder="0.1"
                        tooltip={`Decimals: 18`}
                        {...register(`paymentRules.${index}.price`)}
                        onChange={(e) => {
                          factory.paymentTokens.forEach((_, k) => {
                            setValue(
                              `paymentRules.${k}.price`,
                              e.target.value,
                              { shouldValidate: true },
                            );
                          });
                        }}
                        onBlur={(e) => {
                          factory.paymentTokens.forEach((_, k) => {
                            setValue(
                              `paymentRules.${k}.price`,
                              e.target.value,
                              { shouldValidate: true },
                            );
                          });
                        }}
                        errorMessage={
                          errors?.paymentRules?.[index]?.price?.message
                        }
                      />
                      <Field
                        label="Min Purchase"
                        placeholder="0.1"
                        tooltip={`Decimals: ${token.decimals}`}
                        {...register(`paymentRules.${index}.minPurchase`)}
                        errorMessage={
                          errors?.paymentRules?.[index]?.minPurchase?.message
                        }
                      />
                      <Field
                        label="Max Purchase"
                        placeholder="100"
                        tooltip={`Decimals: ${token.decimals}`}
                        {...register(`paymentRules.${index}.maxPurchase`)}
                        errorMessage={
                          errors?.paymentRules?.[index]?.maxPurchase?.message
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="w-[33.75rem] max-4xl:w-[27.5rem] max-2xl:w-[23rem] max-lg:w-full max-lg:mt-3">
            <div className="flex justify-end mb-3">
              <ConnectButton
                accountStatus="address"
                chainStatus="name"
                showBalance={false}
              />
            </div>
            <FactoryInfo chain={selectedChain} factory={factory} />
            <BalanceInfo
              factory={factory}
              saleTokenBalance={sBalance?.formatted ?? "0"}
              saleTokenAllowance={sAllowance}
              totalRequired={totalRequired}
            />
            {Object.keys(errors).length > 0 || !isConnected ? (
              <Button
                type="submit"
                isWhite
                disabled
                className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full gap-2"
              >
                Send Transaction & Save
              </Button>
            ) : !balanceIsSufficient ? (
              <Button
                type="button"
                isWhite
                disabled
                className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full gap-2 !text-primary-03"
              >
                Insufficient balance
              </Button>
            ) : !allowanceIsSufficient ? (
              <TokenApproveButton
                token={factory.saleToken}
                spender={factory.address!}
                amount={totalRequired}
                onSuccess={() => {
                  console.log(
                    dayjs().format("mm:ss SSS"),
                    "approve.success, to refetch allowance",
                  );
                  refetchSAllowance?.();
                }}
                buttonClass="inline-flex items-center justify-center h-12 border rounded-3xl text-button transition-all cursor-pointer disabled:pointer-events-none bg-b-surface2 px-7 border-0 text-t-secondary fill-t-secondary hover:text-t-primary hover:fill-t-primary dark:bg-linear-to-b dark:from-[#2A2A2A] dark:to-[#202020] px-6.5 max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full gap-2"
              />
            ) : (
              <Button
                type="submit"
                isWhite
                disabled={isTxPending}
                className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full gap-2"
              >
                {txHash ? "Save again" : "Send Transaction & Save"}
                {isTxPending && <MoonLoader size={20} color="#727272" />}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default PoolForm;
