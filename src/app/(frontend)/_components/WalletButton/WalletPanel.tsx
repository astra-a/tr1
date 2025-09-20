import {
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import Image from "next/image";
import {
  faArrowRightFromBracket,
  faCheck,
  faCopy,
  faTriangleExclamation,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MoonLoader } from "react-spinners";
import { useCopyToClipboard } from "react-use";
import { Address } from "viem";
import { useAccount, useChains, useDisconnect } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import {
  ALL_TOKENS,
  NETWORKS_ICON,
  ONE_BYTES32,
  useBalance,
  IToken,
  displayBalance,
} from "@/web3";
import {
  IERC20Approve,
  IPoolClaim,
  IPoolPurchase,
  ITransaction,
  useWalletStore,
} from "@/stores";
import { LOCK_MAP } from "@/constants";

dayjs.extend(relativeTime);

const GROUP_WEEK_NAME = "This Week";

function TokenItem({ account, token }: { account: Address; token: IToken }) {
  const { data } = useBalance({
    chainId: token.chainId,
    token: token.address as Address,
    unit: token.decimals,
    address: account,
    // watch: true,
    // query: {
    //   enabled: isActive && token.chainId === chainId,
    // },
  });

  return (
    <div className="flex justify-between items-center gap-2">
      <Image
        src={token.logo}
        alt={token.symbol}
        width={32}
        height={32}
        className="flex-none"
      />
      <div className="flex flex-auto w-0 flex-col gap-1.5">
        <p className="text-sm leading-none text-white line-clamp-1">
          {token.symbol}
        </p>
        <p className="text-xs leading-none text-white/70 line-clamp-1">
          {token.name}
        </p>
      </div>
      <div className="flex-none">
        <p className="text-sm text-white line-clamp-1">
          {data?.formatted ? displayBalance(data.formatted) : "--"}{" "}
          {token.symbol}
        </p>
      </div>
    </div>
  );
}

function TokenTabPanel() {
  const { address: account, chainId } = useAccount();
  const tokens: IToken[] = useMemo(() => {
    if (chainId) {
      return ALL_TOKENS?.[chainId] ?? [];
    }
    return [];
  }, [chainId]);

  return tokens.length ? (
    <div className="flex flex-col gap-4 max-h-60 -mr-4 pr-4 overflow-auto">
      {tokens.map((token) => (
        <TokenItem key={token.address} account={account!} token={token} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-2 pt-2 px-10">
      <div className="text-base font-semibold text-white">No tokens yet</div>
      <div className="text-xs text-white text-center">
        Buy or transfer tokens to this wallet to get started.
      </div>
    </div>
  );
}

function ActivityItem_ERC20({ tx }: { tx: ITransaction }) {
  const content = tx.content as IERC20Approve;
  return (
    <>
      <p className="text-sm leading-none text-white line-clamp-1">
        Approve{" "}
        {content.amount === ONE_BYTES32 ? "" : displayBalance(content.amount)}{" "}
        {content.token.symbol}
      </p>
      <p
        className="text-xs leading-none text-vermilion line-clamp-1"
        // className="text-neon-green"
        // className="text-vermilion"
      >
        Approve
      </p>
    </>
  );
}

function ActivityItem_PoolPurchase({ tx }: { tx: ITransaction }) {
  const content = tx.content as IPoolPurchase;
  return (
    <>
      <p className="text-sm leading-none text-white line-clamp-1">
        {LOCK_MAP.past} {displayBalance(content.stakedAmount)}{" "}
        {content.poolConfig.saleToken.symbol}
      </p>
      <p
        className="text-xs leading-none text-neon-green line-clamp-1"
        // className="text-neon-green"
        // className="text-vermilion"
      >
        Payment {displayBalance(content.paymentAmount)}{" "}
        {content.poolConfig.paymentToken.symbol}
      </p>
    </>
  );
}

function ActivityItem_PoolClaim({ tx }: { tx: ITransaction }) {
  const content = tx.content as IPoolClaim;
  return (
    <>
      <p className="text-sm leading-none text-white line-clamp-1">
        Claimed {displayBalance(content.amount)}{" "}
        {content.poolConfig.saleToken.symbol}
      </p>
      <p
        className="text-xs leading-none text-neon-green line-clamp-1"
        // className="text-neon-green"
        // className="text-vermilion"
      />
    </>
  );
}

function ActivityItem({ tx }: { tx: ITransaction }) {
  const chains = useChains();
  const chain = useMemo(
    () => chains.find((c) => c.id === tx.chainId),
    [chains, tx],
  );
  const token = useMemo(() => {
    if ("erc20-approve" === tx.action) {
      return ALL_TOKENS?.[tx.chainId]?.find(
        (t) =>
          t.chainId === tx.chainId &&
          t.address.toLowerCase() ===
            (tx.content as IERC20Approve).token.address.toLowerCase(),
      );
    } else if (["pool-purchase", "pool-claim"].includes(tx.action)) {
      return ALL_TOKENS?.[tx.chainId]?.find(
        (t) =>
          t.chainId === tx.chainId &&
          t.address.toLowerCase() ===
            (
              tx.content as IPoolPurchase | IPoolClaim
            ).poolConfig.saleToken.address.toLowerCase(),
      );
    }
    return undefined;
  }, [tx]);

  return (
    <Link
      className="flex justify-between items-center gap-2"
      href={chain ? `${chain?.blockExplorers?.default.url}/tx/${tx.hash}` : ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="flex items-center">
        <Image
          src={NETWORKS_ICON?.[tx.chainId] ?? "/images/network-ethereum.svg"}
          alt=""
          width={16}
          height={16}
          className="flex-none"
        />
        {token ? (
          <div className="flex-none border-1 border-charcoal-black rounded-xl -ml-1.5">
            <Image src={token.logo} alt={token.symbol} width={16} height={16} />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-auto w-0 flex-col gap-1.5">
        {"erc20-approve" === tx.action ? (
          <ActivityItem_ERC20 tx={tx} />
        ) : "pool-purchase" === tx.action ? (
          <ActivityItem_PoolPurchase tx={tx} />
        ) : "pool-claim" === tx.action ? (
          <ActivityItem_PoolClaim tx={tx} />
        ) : (
          <></>
        )}
      </div>
      <div className="flex-none">
        {"error" === tx.status ? (
          <FontAwesomeIcon icon={faTriangleExclamation} color="#ff4c29" />
        ) : "pending" === tx.status ? (
          <MoonLoader size={16} color="white" />
        ) : (
          <p className="text-sm text-white/70 line-clamp-1">
            {dayjs.unix(tx.timestamp).fromNow(true)}
          </p>
        )}
      </div>
    </Link>
  );
}

function ActivityTabPanel() {
  const { address: account, isConnected } = useAccount();
  const chains = useChains();
  const [transactions] = useWalletStore(
    useShallow((state) => [state.transactions]),
  );

  const chainIds = useMemo(
    () => (chains?.length ? chains.map((c) => c.id) : []),
    [chains],
  );

  const [activityGroups, setActivityGroups] = useState<
    { group: string; transactions: ITransaction[] }[]
  >([]);
  useEffect(() => {
    if (isConnected && account && transactions?.length) {
      const weekTime = dayjs().startOf("week").unix();
      const _activity: { group: string; transactions: ITransaction[] }[] = [];
      const _transactions = transactions.filter(
        (tx) =>
          tx.owner.toLowerCase() === account.toLowerCase() &&
          chainIds.includes(tx.chainId),
      );
      _transactions.sort((a, b) => b.timestamp - a.timestamp);
      for (const tx of _transactions) {
        if (tx.timestamp >= weekTime) {
          let weekIndex = _activity.findIndex(
            (group) => group.group === GROUP_WEEK_NAME,
          );
          if (weekIndex === -1) {
            weekIndex = _activity.length;
            _activity.push({ group: GROUP_WEEK_NAME, transactions: [] });
          }
          _activity[weekIndex].transactions.push(tx);
        } else {
          const year = dayjs.unix(tx.timestamp).year();
          let yearIndex = _activity.findIndex(
            (group) => group.group === year.toString(),
          );
          if (yearIndex === -1) {
            yearIndex = _activity.length;
            _activity.push({ group: year.toString(), transactions: [] });
          }
          _activity[yearIndex].transactions.push(tx);
        }
      }
      setActivityGroups(_activity);
    }
  }, [isConnected, account, transactions]);

  return activityGroups.length ? (
    <div className="flex flex-col gap-4 max-h-60 -mr-4 pr-4 overflow-auto">
      {activityGroups.map((group) => (
        <div key={group.group} className="flex flex-col items-start gap-2">
          <div className="px-2 py-1 bg-dark-greenish-gray rounded-sm text-xs leading-none text-white">
            {group.group}
          </div>
          <div className="flex flex-col gap-4 w-full">
            {group.transactions.map((tx) => (
              <ActivityItem key={tx.hash} tx={tx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-2 pt-2 px-6">
      <div className="text-base font-semibold text-white">No activity yet</div>
      <div className="text-xs text-white text-center">
        Your onchain transactions and crypto purchases will appear here.
      </div>
    </div>
  );
}

function Tabs() {
  const [selected, setSelected] = useState(0);

  return (
    <TabGroup selectedIndex={selected} onChange={setSelected}>
      <TabList className="flex items-center gap-4 pb-1 text-base font-semibold text-light-blue-gray hover:text-bright-aqua/75 border-b-1 border-very-dark-green">
        <Tab
          className={`cursor-pointer ${selected === 0 ? "text-bright-aqua" : ""}`}
        >
          Tokens
        </Tab>
        <Tab
          className={`cursor-pointer ${selected === 1 ? "text-bright-aqua" : ""}`}
        >
          Activity
        </Tab>
      </TabList>
      <TabPanels className="pt-4">
        <TabPanel>
          <TokenTabPanel />
        </TabPanel>
        <TabPanel>
          <ActivityTabPanel />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

export default function WalletPanel({
  account,
  chain,
}: {
  account: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
  chain: {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
  };
}) {
  const { chain: connectedChain, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    copyToClipboard(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <>
      <PopoverPanel
        anchor="bottom"
        className="wallet-popover-panel w-82.5 px-6 py-8 mt-2 flex flex-col gap-5 bg-charcoal-black rounded-xl shadow-[0_12px_23px_rgb(0,0,0)] relative z-30"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Image
                src={NETWORKS_ICON?.[chain.id] ?? ""}
                alt={chain?.name ?? ""}
                width={16}
                height={16}
              />
              <p className="text-sm text-white/70">
                Connected via {connector?.name}
              </p>
            </div>
            {/*<div className="text-sm text-white">FAUCET</div>*/}
          </div>
          <div className="flex justify-between items-center">
            <a
              className="text-sm text-white hover:underline transition"
              href={`${connectedChain?.blockExplorers?.default.url}/address/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {account.displayName}
            </a>
            <div className="flex items-center gap-3">
              <button
                className={`w-6 h-6 flex justify-center items-center bg-medium-gray rounded-md ${copied ? `text-mint-green` : "text-dark-greenish-gray"} hover:text-mint-green cursor-pointer transition`}
                onClick={handleCopy}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              </button>
              <a
                className="w-6 h-6 flex justify-center items-center bg-medium-gray rounded-md text-dark-greenish-gray hover:text-mint-green cursor-pointer transition"
                href={`${connectedChain?.blockExplorers?.default.url}/address/${account.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faUpRightFromSquare} />
              </a>
              <button
                className="w-6 h-6 flex justify-center items-center bg-medium-gray rounded-md text-dark-greenish-gray hover:text-mint-green cursor-pointer transition"
                onClick={() => disconnect()}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full h-20 flex justify-center items-center text-lg text-white bg-eerie-black border-2 border-dark-greenish-gray rounded-lg shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
          {account.displayBalance}
        </div>
        <Tabs />
      </PopoverPanel>
    </>
  );
}
