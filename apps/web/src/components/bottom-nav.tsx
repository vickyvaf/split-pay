"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, HandCoins, Bot, History } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Bill", href: "/create", icon: HandCoins },
  { name: "AI Chat", href: "/ai", icon: Bot },
  { name: "History", href: "/history", icon: History },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white border-t border-gray-100 pointer-events-auto pb-[env(safe-area-inset-bottom)]">
        <nav className="flex items-center justify-around w-full h-20 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] h-16 rounded-2xl",
                  isActive ? "text-[#047857]" : "text-slate-400"
                )}
              >
                <item.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    "transition-transform active:scale-95",
                  )}
                />
                <span className="text-[12px] font-medium tracking-tight">
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
