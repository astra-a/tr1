import BigNumber from "bignumber.js";
import { YEAR_SECONDS } from "@/constants";

export const getApr = (apr: number): number => {
  return apr / 10_000;
};

export const getAprPercent = (apr: number): string => {
  return `${apr / 100}%`;
};

export const calculateStakeReward = (
  stakeAmount: string | number,
  apr: number,
  duration: number,
  decimals?: number,
) => {
  const val = BigNumber(stakeAmount)
    .times(getApr(apr))
    .times(duration)
    .div(YEAR_SECONDS);
  return decimals ? val.toFixed(decimals, 1) : val.toString();
};

export const shortenAddress = (
  address?: string | null,
  charsStart = 4,
  charsEnd = 4,
): string => {
  if (!address) return "";
  if (address.length < charsStart + charsEnd) return address;
  const hasPrefix = address.startsWith("0x");
  return `${address.slice(0, hasPrefix ? charsStart + 2 : charsStart)}...${address.slice(0 - charsEnd)}`;
};

export const shortenHash = (
  hash?: string | null,
  charsStart = 4,
  charsEnd = 4,
): string => {
  if (!hash) return "";
  if (hash.length < charsStart + charsEnd) return hash;
  const hasPrefix = hash.startsWith("0x");
  return `${hash.slice(0, hasPrefix ? charsStart + 2 : charsStart)}...${hash.slice(0 - charsEnd)}`;
};

export const displayBalance = (num: string | number) => {
  const _num = Number(num);
  if (_num >= 10_000) {
    return _num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else if (_num >= 10) {
    return _num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } else if (_num >= 0.01) {
    return _num.toLocaleString(undefined, { maximumFractionDigits: 4 });
  } else if (_num >= 0.000001) {
    return _num.toLocaleString(undefined, { maximumFractionDigits: 6 });
  } else if (_num > 0) {
    return "<0.000001";
  }
  return "0";
};
