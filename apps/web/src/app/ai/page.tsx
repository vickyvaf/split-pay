"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from "lucide-react"

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! I'm your SplitPay Assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages([...messages, userMessage])
    setInput("")

    // Bot response placeholder
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        content: "I'm ready to help! Please connect your data or provide bill details."
      }])
    }, 1000)
  }

  const suggestions = [
    "Who hasn't paid yet?",
    "Show my pending debts",
    "Send reminders to everyone",
    "Is Budi already paid?"
  ]

  return (
    <div className="flex flex-col min-h-[calc(100dvh-14rem)]">
      {/* Chat Messages */}
      <div className="flex-1 space-y-4 pb-24 px-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-3 rounded-xl text-sm ${msg.role === "user"
                ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                : "bg-white border border-border shadow-sm rounded-tl-none text-foreground"
                }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mt-8">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s)}
                  className="text-xs bg-white border border-border px-3 py-2 rounded-full hover:border-primary hover:text-primary transition-colors shadow-sm font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Sticky above BottomNav */}
      <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-md pt-3 pb-2 -mx-4 px-4 border-t border-border/50 -mb-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="pr-12 h-12 rounded-xl bg-white border-border focus:border-primary shadow-sm text-sm"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 rounded-lg shadow-md shadow-primary/20"
              onClick={sendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
