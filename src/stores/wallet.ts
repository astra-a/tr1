import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type TransactionStatus = "idle" | "pending" | "success" | "error";

// action: erc20-approve
export interface IERC20Approve {
  token: {
    address: string;
    name?: string | null;
    symbol: string;
    decimals: number;
  };
  amount: string;
}

// action: pool-purchase
export interface IPoolPurchase {
  poolName: string;
  poolConfig: {
    address: string;
    paymentToken: {
      address: string;
      name?: string | null;
      symbol: string;
      decimals: number;
    };
    saleToken: {
      address: string;
      name?: string | null;
      symbol: string;
      decimals: number;
    };
    apr: number;
    lockDuration: number;
  };
  paymentAmount: string;
  stakedAmount: string;
}

// action: pool-claim
export interface IPoolClaim {
  poolName: string;
  poolConfig: {
    address: string;
    saleToken: {
      address: string;
      name?: string | null;
      symbol: string;
      decimals: number;
    };
  };
  amount: string;
}

export interface ITransaction {
  timestamp: number;
  action: string;
  owner: string;
  chainId: number;
  hash: string;
  status: TransactionStatus;
  content: IERC20Approve | IPoolPurchase | IPoolClaim;
}

export interface WalletState {
  transactions: ITransaction[];
  addTransaction: (tx: ITransaction) => void;
  updateTransaction: (
    chainId: number,
    hash: string,
    status: TransactionStatus,
  ) => void;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: [],
        addTransaction: (tx: ITransaction) => {
          if (
            get().transactions.findIndex((item) => item.hash === tx.hash) === -1
          ) {
            set({ transactions: [...get().transactions, tx] });
          }
        },
        updateTransaction: (
          chainId: number,
          hash: string,
          status: TransactionStatus,
        ) => {
          const transactions = get().transactions;
          const index = transactions.findIndex(
            (item) =>
              item.chainId === chainId &&
              item.hash.toLowerCase() === hash.toLowerCase(),
          );
          if (index > -1) {
            transactions[index].status = status;
            set({ transactions: [...transactions] });
          }
        },
      }),
      {
        name: "wallet",
        version: 1,
      },
    ),
  ),
);
