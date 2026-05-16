"use client"

import { ConnectButton } from "@/components/connect-button"
import Link from "next/link"
import { Wallet } from "lucide-react"

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 pointer-events-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95 shrink-0">
            <div className="bg-primary p-1.5 rounded-md text-primary-foreground group-hover:rotate-3 transition-transform">
              <Wallet size={18} />
            </div>
            {/* <div className="flex flex-col leading-none">
              <span className="font-bold text-base tracking-tight text-foreground whitespace-nowrap">SplitPay</span>
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider whitespace-nowrap">Web3 Billing</span>
            </div> */}
          </Link>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}
