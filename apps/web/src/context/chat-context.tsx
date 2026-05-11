"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface Message {
  role: "user" | "bot";
  content: string;
  isError?: boolean;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm your SplitPay Assistant. I've analyzed your billing history. How can I help you today?" }
  ]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
