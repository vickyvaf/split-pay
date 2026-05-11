"use client"

import { ConnectButton } from "@/components/connect-button"
import Link from "next/link"
import { Wallet } from "lucide-react"

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-3 transition-transform">
            <Wallet size={20} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg tracking-tight text-foreground">SplitPay</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Web3 Billing</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
