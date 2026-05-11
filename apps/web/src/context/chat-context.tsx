"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"

export interface Message {
  role: "user" | "bot";
  content: string;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentSessionId: string | null;
  setCurrentSessionId: React.Dispatch<React.SetStateAction<string | null>>;
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  deleteSession: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm your SplitPay Assistant. I've analyzed your billing history. How can I help you today?" }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const savedSessions = localStorage.getItem("chat_sessions")
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions))
      } catch (e) {
        console.error("Failed to parse chat sessions", e)
      }
    }
  }, [])

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id)
    setSessions(updated)
    localStorage.setItem("chat_sessions", JSON.stringify(updated))
    
    // If we deleted the current session, reset the chat
    if (currentSessionId === id) {
      setCurrentSessionId(null)
      setMessages([
        { role: "bot", content: "Hi! I'm your SplitPay Assistant. I've analyzed your billing history. How can I help you today?" }
      ])
    }
  }

  // Auto-save current session when messages change
  useEffect(() => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.role === "user")?.content || "New Chat"
      const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + "..." : firstUserMsg
      
      const sessionId = currentSessionId || Date.now().toString()
      
      // If this was a new session, set the current ID
      if (!currentSessionId) {
        setCurrentSessionId(sessionId)
      }

      const sessionData: ChatSession = {
        id: sessionId,
        title,
        messages,
        updatedAt: Date.now()
      }

      setSessions(prev => {
        const filtered = prev.filter(s => s.id !== sessionId)
        const updated = [sessionData, ...filtered]
        localStorage.setItem("chat_sessions", JSON.stringify(updated))
        return updated
      })
    }
  }, [messages, currentSessionId])

  return (
    <ChatContext.Provider value={{ 
      messages, 
      setMessages, 
      currentSessionId, 
      setCurrentSessionId,
      sessions,
      setSessions,
      deleteSession
    }}>
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
