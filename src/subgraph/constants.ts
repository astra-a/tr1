import { holesky } from "viem/chains";

export const SUBGRAPH_URLS: { [key: number]: string } = {
  // [bsc.id]: "https://api.studio.thegraph.com/query/75174/bonding-pool-subgraph/version/latest",
  [holesky.id]:
    "http://18.117.183.132:8000/subgraphs/name/bonding-pool-subgraph",
};
