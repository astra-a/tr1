import { DEFAULT_TOKEN_NAME } from "@/constants";
import { bsc, holesky } from "viem/chains";
import { IFactory, IToken } from "./types";

export const ONE_BYTES32 =
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

export const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const OPERATOR_ROLE =
  "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929";

export const POOL_CREATOR_ROLE =
  "0x4066b03ab177190abcd4de6384e71f7a60f56b879537b65d43a0523ade6cfe52";

export const NETWORKS_ICON: { [key: number]: string } = {
  [bsc.id]: "/images/network-bsc.svg",
  // [holesky.id]: "/images/network-ethereum.svg",
};

export const SALE_TOKENS: { [key: number]: IToken } = {
  [bsc.id]: {
    chainId: bsc.id,
    address: "0x8084a35155f56797cb19077979740c8deeab13d6",
    name: DEFAULT_TOKEN_NAME,
    symbol: DEFAULT_TOKEN_NAME,
    decimals: 5,
    logo: "/images/token-aios.svg",
  },
  // [holesky.id]: {
  //   chainId: holesky.id,
  //   address: "0x7807418371Fa50900571d3adb25eC29f527e61B8",
  //   name: DEFAULT_TOKEN_NAME,
  //   symbol: DEFAULT_TOKEN_NAME,
  //   decimals: 5,
  //   logo: "/images/token-aios.svg",
  // },
};

export const PAYMENT_TOKENS: { [key: number]: IToken[] } = {
  [bsc.id]: [
    {
      chainId: bsc.id,
      address: "0x55d398326f99059ff775485246999027b3197955",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 18,
      logo: "/images/token-usdt.svg",
    },
    {
      chainId: bsc.id,
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      logo: "/images/token-usdc.svg",
    },
  ],
  // [holesky.id]: [
  //   {
  //     chainId: holesky.id,
  //     address: "0x57404346543e8D3A922BF6C6b92DfeA1aDB18576",
  //     name: "Tether USD",
  //     symbol: "USDT",
  //     decimals: 18,
  //     logo: "/images/token-usdt.svg",
  //   },
  //   {
  //     chainId: holesky.id,
  //     address: "0x4a7b2b48bBA3A47aC15C09788393B1d1404dB66c",
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     decimals: 18,
  //     logo: "/images/token-usdc.svg",
  //   },
  // ],
};

export const ALL_TOKENS: { [key: number]: IToken[] } = {
  [bsc.id]: [SALE_TOKENS[bsc.id], ...PAYMENT_TOKENS[bsc.id]],
  // [holesky.id]: [SALE_TOKENS[holesky.id], ...PAYMENT_TOKENS[holesky.id]],
};

export const FACTORIES: { [key: number]: IFactory } = {
  [bsc.id]: {
    address: "0xAC1BBf33F73727Dab534063Dd52c48c3971cFDCA",
    treasury: "0xc73cc9a9fFEB6479E3062099B1e03F09A9A140F9",
    saleToken: SALE_TOKENS[bsc.id],
    paymentTokens: PAYMENT_TOKENS[bsc.id],
  },
  // [holesky.id]: {
  //   address: "0xe54fAEE21bA614A965146cCab3FBF249c57e137a",
  //   treasury: "0x3621139d175206e6a159805e8c98A54488bcdE5C",
  //   saleToken: SALE_TOKENS[holesky.id],
  //   paymentTokens: PAYMENT_TOKENS[holesky.id],
  // },
};

export const TEAM_CODES = ["TEAM001"];
