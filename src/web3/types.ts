export interface IToken {
  chainId: number;
  address: string;
  name?: string | null;
  symbol: string;
  decimals: number;
  logo: string;
}

export interface IFactory {
  address: string;
  treasury: string;
  saleToken: IToken;
  paymentTokens: IToken[];
}

export interface IPaymentRule {
  paymentToken: Omit<IToken, "chainId" | "logo">;
  enabled: boolean;
  price: string; //decimals: 18
  minPurchase: string; //decimals: paymentToken
  maxPurchase: string; //decimals: paymentToken
  index: number;
}
