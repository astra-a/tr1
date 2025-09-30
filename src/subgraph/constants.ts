import { holesky } from "viem/chains";

export const SUBGRAPH_URLS: { [key: number]: string } = {
  // [bsc.id]: "/bsc/bonding-pool-subgraph",
  [holesky.id]: "/holesky/bonding-pool-subgraph",
};
