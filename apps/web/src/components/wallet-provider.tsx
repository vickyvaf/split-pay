"use client";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider, createConfig, http, useConnect, useConnectors, useAccount } from "wagmi";
import { celo, celoSepolia } from "wagmi/chains";
import { ConnectButton } from "./connect-button";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "split-pay",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "3fcc6b4444651f9525148f99de2d926a",
  }
);

const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  connectors,
  transports: {
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

function WalletProviderInner({ children }: { children: React.ReactNode }) {
  const { connect } = useConnect();
  const connectors = useConnectors();
  const { isConnected, isConnecting } = useAccount();

  useEffect(() => {
    if (isConnected || isConnecting) return;

    const checkAndConnect = () => {
      const eth = window.ethereum;
      if (eth && eth.isMiniPay) {
        const injectedConnector = connectors.find((c) => c.id === "injected");
        if (injectedConnector) {
          connect({ connector: injectedConnector });
        }
      }
    };

    checkAndConnect();
    
    // Retry after 500ms and 1000ms just in case injection is slow
    const timer1 = setTimeout(checkAndConnect, 500);
    const timer2 = setTimeout(checkAndConnect, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [connect, connectors, isConnected, isConnecting]);

  return <>{children}</>;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletProviderInner>{children}</WalletProviderInner>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
