import { POOL_STATUS } from "@/constants";

export interface IToken {
  id: string; // address
  name: string;
  symbol: string;
  decimals: number;
  totalIncomeAmount: string; // number
  totalSold: string; // number
  totalRewarded: string; // number
}

export interface IFactory {
  id: string; //address
  saleToken: IToken;
  treasury: string; // address
  poolsCount: number;
  participants: number;
  totalCap: string; // number
  totalReward: string; // number
  totalSold: string; // number
  totalRewarded: string; // number
}

export interface IPaymentRule {
  id: string;
  paymentToken: IToken;
  enabled: boolean;
  price: string; // number
  minPurchase: string; // number
  maxPurchase: string; // number
  index: number;
  totalIncomeAmount: string; // number
  totalSold: string; // number
  totalRewarded: string; // number
}

export interface IPool {
  id: string; // address
  status: POOL_STATUS;
  paymentRules: IPaymentRule[];
  saleToken: IToken;
  treasury: string; // address
  name: string;
  team: string;
  apr: number;
  deployedAt: string; // number
  saleStartedAt: string; // number
  saleDuration: number;
  lockDuration: number;
  pausedDurationSum: number;
  totalSaleCap: string; // number
  totalReward: string; // number
  totalSold: string; // number
  totalRewarded: string; // number
  participants: number;
  creator: string; // address
  createdAt: string; // number
  createdBlock: string; // number
  createdHash: string; // hash
}

export interface IBuyer {
  id: string; // address
  totalPayments: number;
  totalBuyAmount: string; // number
  totalInterestAmount: string; // number
  totalClaims: number;
  totalClaimedAmount: string; // number
  totalClaimedBuyAmount: string; // number
  totalClaimedInterestAmount: string; // number
}

export interface IPurchase {
  id: string;
  pool: IPool;
  buyer: IBuyer;
  index: number;
  paymentToken: IToken;
  paymentAmount: string; // number
  saleAmount: string; // number
  rewardAmount: string; // number
  createdAt: string; // number
  createdBlock: string; // number
  createdHash: string; // hash
  claimed: boolean;
  canClaimAt: string; // number
  claimedAmount: null | string; // number
  claimedSaleAmount: null | string; // number
  claimedRewardAmount: null | string; // number
  claimedAt: null | string; // number
  claimedBlock: null | string; // number
  claimedHash: null | string; // hash
}
