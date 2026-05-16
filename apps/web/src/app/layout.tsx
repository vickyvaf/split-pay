import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { TopBar } from '@/components/top-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Footer } from '@/components/footer';
import { WalletProvider } from "@/components/wallet-provider"
import { ChatProvider } from "@/context/chat-context"

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground min-h-screen`} suppressHydrationWarning>
        <WalletProvider>
          <ChatProvider>
            <div className="min-h-screen flex flex-col">
              <TopBar />
              <main className="flex-1 pt-16 pb-20">
                <div className="container max-w-md mx-auto px-4 py-6">
                  {children}
                </div>
                {/* <Footer /> */}
              </main>
            </div>
            <BottomNav />
          </ChatProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
