export const QueryPoolParticipants = `query ($poolAddr: ID!) {
  pool(id: $poolAddr, subgraphError: deny) {
    id
    participants
  }
}`;

export const QueryPoolStats = `query ($poolAddr: ID!) {
  pool(id: $poolAddr, subgraphError: deny) {
    totalSaleCap
    totalReward
    totalSold
    totalRewarded
    participants
  }
}`;

export const QueryBuyerPurchases = `query ($where: Purchase_filter, $skip: Int, $first: Int) {
  purchases(
    skip: $skip
    first: $first
    orderBy: createdAt
    orderDirection: asc
    where: $where
    subgraphError: deny
  ) {
    id
    pool {
      id
      name
      apr
      lockDuration
      saleToken {
        id
        name
        symbol
        decimals
      }
      paymentRules {
        price
      }
    }
    index
    saleAmount
    rewardAmount
    createdAt
    claimed
    canClaimAt
    claimedAmount
  }
}`;

export const QueryPoolPurchases = `query (
  $where: Purchase_filter
  $orderBy: Purchase_orderBy
  $orderDirection: OrderDirection
  $skip: Int
  $first: Int
) {
  purchases(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    subgraphError: deny
  ) {
    id
    pool {
      id
    }
    buyer {
      id
    }
    paymentToken {
      symbol
    }
    paymentAmount
    saleAmount
    rewardAmount
    createdAt
    createdHash
    claimed
    canClaimAt
  }
}`;

export const QueryPoolClaimedPurchases = `query (
  $where: Purchase_filter
  $orderBy: Purchase_orderBy
  $orderDirection: OrderDirection
  $skip: Int
  $first: Int
) {
  purchases(
    skip: $skip
    first: $first
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
    subgraphError: deny
  ) {
    id
    pool {
      id
    }
    buyer {
      id
    }
    paymentToken {
      symbol
    }
    paymentAmount
    claimedAmount
    claimedSaleAmount
    claimedRewardAmount
    claimedAt
    claimedHash
  }
}`;

export const QueryFirstUnclaimPurchase = `query ($where: Purchase_filter, $skip: Int, $first: Int) {
  purchases(
    skip: $skip
    first: $first
    orderBy: createdAt
    orderDirection: asc
    where: $where
    subgraphError: deny
  ) {
    pool {
      id
      name
    }
    paymentAmount
    createdAt
  }
}`;

export const QueryBuyerStats = `query ($account: ID!) {
  buyer(id: $account, subgraphError: deny) {
    id
    totalPayments
    totalBuyAmount
    totalInterestAmount
    totalClaims
    totalClaimedAmount
    totalClaimedBuyAmount
    totalClaimedInterestAmount
  }
}`;

export const QueryTokensStats = `query ($where: Token_filter, $skip: Int, $first: Int) {
  tokens(skip: $skip, first: $first, where: $where, subgraphError: deny) {
    id
    totalIncomeAmount
    totalSold
    totalRewarded
  }
}`;

export const QueryFactoryStats = `query ($id: ID!) {
  factory(id: $id, subgraphError: deny) {
    treasury
    poolsCount
    participants
    totalCap
    totalReward
    totalSold
    totalRewarded
  }
}`;
