"use client";

import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const [isMinipay, setIsMinipay] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (window.ethereum?.isMiniPay) {
      setIsMinipay(true);
    }
  }, []);

  // In MiniPay, hide the button ONLY if already connected.
  // This allows manual connection if auto-connect fails.
  if (isMinipay && isConnected) {
    return null;
  }

  return <RainbowKitConnectButton />;
}
