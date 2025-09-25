"use client";

import { ReactNode } from "react";
import { bsc, holesky } from "viem/chains";
import { createConfig, http, WagmiProvider } from "wagmi";
import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { metaMaskWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import QueryClientProvider from "./TanstackQueryProvider";
import { APP_NAME } from "@/constants";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, trustWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId: "YOUR_PROJECT_ID",
  },
);

const defaultConfig = createConfig({
  // Enables discovery of injected providers via EIP-6963 using the mipd library and converting to injected connectors.
  // e.g. metamask, okx, coinbase, etc.
  // Defaults to true.
  // multiInjectedProviderDiscovery: true,

  // Keep the State['chainId'] in sync with the current connection.
  // Defaults to true.
  // syncConnectedChain: true,

  // Time (in ms) that cached data will remain in memory, for polling enabled features.
  // Defaults to pollingInterval or 4_000.
  // cacheTime: 4_000,

  // Frequency in milliseconds for polling enabled features.
  // Defaults to 4_000.
  // pollingInterval: 4_000,

  ssr: true, // If your dApp uses server side rendering (SSR)

  connectors,
  chains: [holesky],
  transports: {
    // [bsc.id]: http("https://bsc-dataseed1.bnbchain.org"),
    [holesky.id]: http("https://ethereum-holesky.publicnode.com"),
  },
});

export default function CustomWagmiProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={defaultConfig}>
      <QueryClientProvider>
        <RainbowKitProvider locale="en" theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
