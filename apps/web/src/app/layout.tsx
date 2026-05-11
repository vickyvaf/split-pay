import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Footer } from '@/components/footer';
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Split Pay',
  description: 'Split Split bills instantly with friends',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <WalletProvider>
          <div className="relative min-h-screen">
            <TopBar />
            <main className="pt-16">
              <div className="container max-w-md mx-auto px-4 py-6">
                {children}
              </div>
              {/* <Footer /> */}
              <div className="h-24" /> {/* Spacer to clear BottomNav */}
            </main>
            <BottomNav />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
