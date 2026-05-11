"use client";

import { useAccount, useReadContract, useBalance } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { formatAmount } from "@/lib/app-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@/components/connect-button";

const cUSD_ADDRESS = "0x765de816845861e75a25fca122bb6898b8b1282a";
const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
const USDT_ADDRESS = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";

function BalanceDisplay({ address, token, symbol }: { address: `0x${string}`, token?: `0x${string}`, symbol: string }) {
  const isNative = !token;

  const nativeBalance = useBalance({
    address,
    query: {
      enabled: isNative,
    },
  });

  const tokenBalance = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!token,
    },
  });

  const isLoading = isNative ? nativeBalance.isLoading : tokenBalance.isLoading;

  let formattedBalance = "0";
  if (!isLoading) {
    if (isNative && nativeBalance.data) {
      formattedBalance = formatAmount(formatUnits(nativeBalance.data.value, nativeBalance.data.decimals), 4);
    } else if (token && tokenBalance.data !== undefined) {
      const decimals = (symbol === "USDC" || symbol === "USDT") ? 6 : 18;
      formattedBalance = formatAmount(formatUnits(tokenBalance.data as bigint, decimals), 4);
    }
  }

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{symbol}</span>
      <span className="font-medium">
        {isLoading ? "Loading..." : formattedBalance}
      </span>
    </div>
  );
}

export function UserBalance() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading } = useReadContract({
    address: cUSD_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  if (!isConnected || !address) {
    return (
      <Card className="bg-primary text-primary-foreground border-none">
        <CardContent className="p-6 text-center">
          <p className="text-sm opacity-80 mb-2">Connect your wallet to see your balance</p>
          <ConnectButton />
        </CardContent>
      </Card>
    );
  }

  const formattedBalance = balance
    ? formatAmount(formatUnits(balance as bigint, 18), 2)
    : "0";

  return (
    <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>

      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Total Balance</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">{isLoading ? "---" : formattedBalance}</span>
              <span className="text-sm font-medium opacity-80">cUSD</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1 font-bold bg-white text-primary hover:bg-white/90">
            Send
          </Button>
          <Button variant="outline" className="flex-1 font-bold border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
            Top Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
