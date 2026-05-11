"use client";

import { useAccount, useReadContract, useBalance } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  
  let formattedBalance = "0.0000";
  if (!isLoading) {
    if (isNative && nativeBalance.data) {
      formattedBalance = parseFloat(formatUnits(nativeBalance.data.value, nativeBalance.data.decimals)).toFixed(4);
    } else if (token && tokenBalance.data !== undefined) {
      const decimals = (symbol === "USDC" || symbol === "USDT") ? 6 : 18;
      formattedBalance = parseFloat(formatUnits(tokenBalance.data as bigint, decimals)).toFixed(4);
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

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Connected Wallet</CardTitle>
        <p className="text-sm text-muted-foreground truncate pt-1">{address}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 pt-2 border-t">
          <BalanceDisplay address={address} symbol="CELO" token={undefined} />
          <BalanceDisplay address={address} token={cUSD_ADDRESS} symbol="cUSD" />
          <BalanceDisplay address={address} token={USDC_ADDRESS} symbol="USDC" />
          <BalanceDisplay address={address} token={USDT_ADDRESS} symbol="USDT" />
        </div>
      </CardContent>
    </Card>
  );
}
