"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, Sparkles, History } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Bill", href: "/create", icon: Wallet },
  { name: "AI Chat", href: "/ai", icon: Sparkles },
  { name: "History", href: "/history", icon: History },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t border-slate-100 pointer-events-auto pb-[env(safe-area-inset-bottom)]">
        <nav className="flex items-center w-full h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all relative flex-1 h-14",
                  isActive ? "text-[#059669]" : "text-slate-400"
                )}
              >
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 2}
                  className={cn(
                    "transition-all",
                    isActive && "scale-110"
                  )}
                />
                <span className={cn(
                  "text-[11px] font-semibold tracking-tight transition-all",
                  isActive ? "opacity-100" : "opacity-80"
                )}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
