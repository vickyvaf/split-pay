"use client";

import Link from "next/link";
import { UserBalance } from "@/components/user-balance";
import { Plus, Users, ArrowRight, Wallet, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { truncateAddress } from "@/lib/app-utils";

interface Bill {
  id: number;
  name: string;
  amount: string;
  status: "Active" | "Paid" | string;
  participants: number;
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const displayName = isConnected && address ? truncateAddress(address) : "Friend";

  const bills: Bill[] = []; // Empty for testing as requested previously

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hi, {displayName}!</h1>
          <p className="text-muted-foreground text-sm">Ready to split some bills?</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-5 w-5" />
        </div>
      </div>

      {/* Simplified Balance Card */}
      <UserBalance />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4">
        <Link href="/create" className="block">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Plus className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Create New Bill</h3>
                <p className="text-xs text-muted-foreground">Split costs with your group</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-semibold text-foreground">Recent Bills</h2>
          <Button variant="link" size="sm" className="text-primary text-xs p-0 h-auto font-bold">View All</Button>
        </div>

        {/* Mock Data */}
        <div className="space-y-3">
          {bills.length > 0 ? (
            bills.map((bill) => (
              <Card key={bill.id} className="border-border shadow-sm rounded-lg hover:bg-muted/10 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm ${bill.status === "Active" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-foreground">{bill.name}</h4>
                      <p className="text-xs text-muted-foreground">{bill.participants} participants</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-foreground">{bill.amount} cUSD</div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${bill.status === "Active" ? "text-orange-500" : "text-green-500"}`}>{bill.status}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 bg-muted/5 rounded-2xl border border-dashed border-border/50">
              <p className="text-xs font-bold text-muted-foreground">No recent bills found</p>
              <p className="text-[10px] text-muted-foreground/60">Create your first bill to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Callout */}
      <Card className="bg-secondary/30 border-dashed border-primary/30 rounded-xl">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="text-primary mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Need help?</p>
            <p className="text-xs text-muted-foreground">Ask our AI Agent about your pending debts.</p>
            <Link href="/ai" className="text-xs text-primary font-bold mt-2 inline-flex items-center gap-1 group">
              Try AI Assistant
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
