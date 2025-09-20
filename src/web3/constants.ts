import { DEFAULT_TOKEN_NAME } from "@/constants";
import { bsc, holesky } from "viem/chains";
import { IFactory, IToken } from "./types";

export const ONE_BYTES32 =
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

export const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export const OPERATOR_ROLE =
  "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929";

export const NETWORKS_ICON: { [key: number]: string } = {
  [bsc.id]: "/images/network-bsc.svg",
  [holesky.id]: "/images/network-ethereum.svg",
};

export const SALE_TOKENS: { [key: number]: IToken } = {
  // [bsc.id]: {
  //   chainId: bsc.id,
  //   address: "",
  //   name: DEFAULT_TOKEN_NAME,
  //   symbol: DEFAULT_TOKEN_NAME,
  //   decimals: 6,
  //   logo: "/images/token-aios.svg",
  // },
  [holesky.id]: {
    chainId: holesky.id,
    address: "0xde04e26cc0990fc417745fdd37ea3f7b690af80e",
    name: DEFAULT_TOKEN_NAME,
    symbol: DEFAULT_TOKEN_NAME,
    decimals: 6,
    logo: "/images/token-aios.svg",
  },
};

export const PAYMENT_TOKENS: { [key: number]: IToken[] } = {
  // [bsc.id]: [
  //   {
  //     chainId: bsc.id,
  //     address: "0x55d398326f99059ff775485246999027b3197955",
  //     name: "Tether USD",
  //     symbol: "USDT",
  //     decimals: 18,
  //     logo: "/images/token-usdt.svg",
  //   },
  //   {
  //     chainId: bsc.id,
  //     address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     decimals: 18,
  //     logo: "/images/token-usdc.svg",
  //   },
  // ],
  [holesky.id]: [
    {
      chainId: holesky.id,
      address: "0xb39f1a5566dbda75b978ae9b03374b1ff0f9c72d",
      name: "USDT",
      symbol: "USDT",
      decimals: 6,
      logo: "/images/token-usdt.svg",
    },
    {
      chainId: holesky.id,
      address: "0x5991fc2010affd28e7d10042e862da3a3d305004",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      logo: "/images/token-usdc.svg",
    },
  ],
};

export const ALL_TOKENS: { [key: number]: IToken[] } = {
  // [bsc.id]: [],
  [holesky.id]: [SALE_TOKENS[holesky.id], ...PAYMENT_TOKENS[holesky.id]],
};

export const FACTORIES: { [key: number]: IFactory } = {
  // [bsc.id]: "",
  [holesky.id]: {
    address: "0x36CA97aA7c6fd8942D8850fE8cd0935a491a0310",
    treasury: "0x3621139d175206e6a159805e8c98A54488bcdE5C",
    saleToken: SALE_TOKENS[holesky.id],
    paymentTokens: PAYMENT_TOKENS[holesky.id],
  },
};

export const TEAM_CODES = ["TEAM001"];
