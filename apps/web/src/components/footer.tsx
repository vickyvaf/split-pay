"use client"

import Link from "next/link"
import { Globe } from "lucide-react"

// Brand icons were removed in lucide-react v1.0.0+
const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const TwitterXIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
)

export function Footer() {
  return (
    <footer className="w-full py-12 px-4 border-t bg-muted/30">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
              <Globe size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">SplitPay</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            The easiest way to split bills with friends using Celo and MiniPay.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-center sm:text-left">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">Product</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/create" className="hover:text-primary transition-colors">Create Bill</Link></li>
              <li><Link href="/history" className="hover:text-primary transition-colors">History</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground/50">Links</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="https://docs.celo.org" target="_blank" className="hover:text-primary transition-colors">Celo Docs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-8 border-t border-border/50">
          <div className="flex gap-4">
            <Link href="https://github.com" className="p-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-all">
              <GithubIcon size={18} />
            </Link>
            <Link href="https://twitter.com" className="p-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-all">
              <TwitterXIcon size={18} />
            </Link>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            © 2026 SplitPay • Built on Celo
          </p>
        </div>
      </div>
    </footer>
  )
}
