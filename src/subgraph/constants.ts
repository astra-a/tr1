import { holesky } from "viem/chains";

export const SUBGRAPH_URLS: { [key: number]: string } = {
  // [bsc.id]: "http://18.117.183.132:8000/subgraphs/name/bonding-pool-subgraph",
  [holesky.id]:
    "http://18.117.183.132:8000/subgraphs/name/bonding-pool-subgraph",
};
