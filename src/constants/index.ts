export const APP_NAME = "AIOS";
export const APP_TITLE = APP_NAME;
export const APP_DESCRIPTION =
  "Built on distributed ledgers and cross-chain interoperability, it streamlines blockchain interaction — from Ethereum to Solana to BSC — with AI managing contracts, transfers, and security, all while you retain full control.";
export const APP_BASEURL = process.env.APP_BASEURL || "http://localhost:3000";

export const CDN_BASEURL = process.env.NEXT_PUBLIC_CDN_BASEURL || "";

export const DASHBOARD_APP_NAME = APP_NAME;
export const DASHBOARD_APP_TITLE = `${DASHBOARD_APP_NAME} Dashboard`;
export const DASHBOARD_APP_DESCRIPTION = `${DASHBOARD_APP_NAME} Dashboard`;
export const DASHBOARD_APP_BASEURL = APP_BASEURL;

export const DEFAULT_TOKEN_NAME = "AIOS";

export const DEFAULT_TOKEN_PRICE = 0.1;

export const DEFAULT_PRICE_SYMBOL = "USD";

export enum POST_STATUS {
  Published = "published",
  Draft = "draft",
}
export const PostStatusList = [
  { label: "Draft", value: POST_STATUS.Draft },
  { label: "Published", value: POST_STATUS.Published },
];

export enum POOL_STATUS {
  Active = "ACTIVE",
  Paused = "PAUSED",
  Stopped = "STOPPED",
  Creating = "CREATING",
  SoldOut = "SOLD_OUT",
  Upcoming = "UPCOMING",
  Failed = "FAILED",
}
export const PoolStatusLabels = {
  [POOL_STATUS.Active]: "In Progress",
  [POOL_STATUS.Paused]: "Paused",
  [POOL_STATUS.Stopped]: "Stopped",
  [POOL_STATUS.Creating]: "Creating",
  [POOL_STATUS.SoldOut]: "Sold Out",
  [POOL_STATUS.Upcoming]: "Upcoming",
  [POOL_STATUS.Failed]: "Failed",
};
export const DashboardStatusLabels = {
  [POOL_STATUS.Active]: "label-green",
  [POOL_STATUS.Paused]: "label-yellow",
  [POOL_STATUS.Stopped]: "label-gray",
  [POOL_STATUS.Creating]: "label-gray",
  [POOL_STATUS.SoldOut]: "label-red",
  [POOL_STATUS.Upcoming]: "label-yellow",
  [POOL_STATUS.Failed]: "label-red",
};
export const PoolStatusList = [
  { label: PoolStatusLabels[POOL_STATUS.Active], value: POOL_STATUS.Active },
  { label: PoolStatusLabels[POOL_STATUS.Paused], value: POOL_STATUS.Paused },
  { label: PoolStatusLabels[POOL_STATUS.Stopped], value: POOL_STATUS.Stopped },
  { label: PoolStatusLabels[POOL_STATUS.SoldOut], value: POOL_STATUS.SoldOut },
  {
    label: PoolStatusLabels[POOL_STATUS.Creating],
    value: POOL_STATUS.Creating,
  },
  {
    label: PoolStatusLabels[POOL_STATUS.Upcoming],
    value: POOL_STATUS.Upcoming,
  },
  // { label: PoolStatusLabels[POOL_STATUS.Failed], value: POOL_STATUS.Failed },
];

export const LOCK_MAP = {
  general: "Lock",
  progressive: "Locking",
  past: "Locked",
  plural: "Locks",
};

export const EARN_MAP = {
  general: "Earn",
  progressive: "Earning",
  past: "Earned",
  plural: "Earns",
};

export const DAY_SECONDS = 86_400;
export const YEAR_SECONDS = 31_536_000; // 365d * 86_400

export const TOTAL_SALE_CAP = 250_000_000;
