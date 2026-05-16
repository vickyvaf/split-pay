"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot, Mic, MicOff, RefreshCw, Pencil, Plus, MessageSquare, Clock, X } from "lucide-react"

import { GoogleGenerativeAI } from "@google/generative-ai"

import { useChat, Message, ChatSession } from "@/context/chat-context"

interface Member {
  name: string;
  address: string;
}

interface HistoryItem {
  id: number;
  name: string;
  date: string;
  amount: string;
  status: "Completed" | "Paid" | "Pending" | string;
  type: "initiated" | "member" | string;
  members?: Member[];
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const SYSTEM_INSTRUCTION = `You are SplitPay Assistant, a helpful AI that helps users manage shared bills, track debts, and remind participants to pay. 
You are integrated into the SplitPay app which is built on Celo/MiniPay. 

Today's date is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Current user's billing history is provided below. Use this data to answer questions about recent spending, pending payments, and participants.
If the user asks "who hasn't paid", look for bills with "Pending" status and list the participants.
If they ask "what did I buy recently", look at the most recent entries in the history.

Be concise, friendly, and helpful. Always refer to amounts in cUSD.`;

export default function AIAgent() {
  const { messages, setMessages, currentSessionId, setCurrentSessionId, sessions, deleteSession } = useChat()
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id)
    setMessages(session.messages)
  }

  const startNewChat = () => {
    setCurrentSessionId(null)
    setMessages([
      { role: "bot", content: "Hi! I'm your SplitPay Assistant. I've analyzed your billing history. How can I help you today?" }
    ])
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("billing_history")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    }
  }, [])

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = (event: any) => {
      console.error(event.error)
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev ? `${prev} ${transcript}` : transcript)
    }

    recognition.start()
  }

  const sendMessage = async (overrideContent?: string) => {
    const messageContent = overrideContent || input
    if (!messageContent.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: messageContent }
    setMessages(prev => [...prev, userMessage])
    const currentInput = messageContent
    if (!overrideContent) setInput("")
    setIsLoading(true)

    try {
      // Prepare history for Gemini - must start with 'user' role
      const chatHistory = messages.map(msg => ({
        role: msg.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.content }]
      }))

      const firstUserIndex = chatHistory.findIndex(m => m.role === "user")
      const validHistory = firstUserIndex !== -1 ? chatHistory.slice(firstUserIndex) : []

      // Create model with context-aware system instruction
      const historyContext = history.length > 0
        ? `\n\nUSER BILLING HISTORY:\n${JSON.stringify(history, null, 2)}`
        : "\n\nUSER BILLING HISTORY: No history found.";

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_INSTRUCTION + historyContext
      });

      const chat = model.startChat({
        history: validHistory,
      })

      const result = await chat.sendMessage(currentInput)
      const response = await result.response
      const text = response.text()

      setMessages(prev => [...prev, {
        role: "bot",
        content: text
      }])
    } catch (error) {
      console.error("Gemini Error:", error)
      setMessages(prev => {
        const newMessages = [...prev]
        // Find the last user message and mark it as error
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].role === "user") {
            newMessages[i] = { ...newMessages[i], isError: true }
            break
          }
        }
        return newMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = (content: string) => {
    // Remove the message with error first to avoid duplicates when sending
    setMessages(prev => prev.filter(m => !m.isError))
    sendMessage(content)
  };

  const handleEdit = (content: string) => {
    // Remove the message with error
    setMessages(prev => prev.filter(m => !m.isError))
    setInput(content)
  };

  const suggestions = [
    "Who hasn't paid yet?",
    "What did I just buy?",
    "Send reminders to everyone"
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
              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} gap-2`}>
                <div className={`p-3 rounded-xl text-sm ${msg.role === "user"
                  ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                  : "bg-white border border-border shadow-sm rounded-tl-none text-foreground"
                  }`}>
                  {msg.content}
                </div>
                {msg.role === "user" && msg.isError && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetry(msg.content)}
                      className="h-7 text-[9px] font-bold uppercase tracking-widest gap-1.5 rounded-lg border-primary/20 text-primary hover:bg-primary/5 hover:text-primary bg-white/50"
                    >
                      <RefreshCw className="h-2.5 w-2.5" />
                      Retry
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(msg.content)}
                      className="h-7 text-[9px] font-bold uppercase tracking-widest gap-1.5 rounded-lg border-border text-muted-foreground hover:bg-secondary hover:text-primary bg-white/50"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary text-primary flex-shrink-0 flex items-center justify-center shadow-sm">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="p-3 rounded-xl text-sm bg-white border border-border shadow-sm rounded-tl-none text-foreground flex items-center gap-1 min-h-[40px]">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
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

      {/* Input Area - Fixed above BottomNav */}
      <div className="fixed bottom-20 left-0 right-0 z-20 bg-background/95 backdrop-blur-md pt-3 pb-4 px-4 border-t border-border/50">
        <div className="max-w-md mx-auto">
          {/* Chat History Badges */}
          <div className="flex items-center gap-2 mb-3 py-1">
            <div className="flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={startNewChat}
                className={`h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-primary/20 text-primary bg-primary/5 gap-1.5 ${!currentSessionId ? 'ring-1 ring-primary/30' : ''}`}
              >
                <Plus className="h-3 w-3" />
                New
              </Button>
            </div>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar relative">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className={`flex-shrink-0 flex items-center rounded-lg border transition-all overflow-hidden ${currentSessionId === s.id
                    ? "bg-primary border-primary shadow-md shadow-primary/20"
                    : "bg-white border-border shadow-sm hover:border-primary/50"
                    }`}
                >
                  <button
                    onClick={() => loadSession(s)}
                    className={`px-3 py-1.5 text-[11px] font-medium whitespace-nowrap flex items-center gap-2 ${currentSessionId === s.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <MessageSquare className={`h-3 w-3 ${currentSessionId === s.id ? "text-white" : "text-muted-foreground"}`} />
                    {s.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className={`px-2 py-1.5 flex items-center justify-center border-l transition-all ${currentSessionId === s.id
                      ? "text-white/70 border-white/20 hover:text-white hover:bg-destructive"
                      : "text-muted-foreground border-border hover:text-destructive hover:bg-destructive/5"
                      }`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="text-[10px] text-muted-foreground italic px-2 flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  No previous chats
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="pr-24 h-12 rounded-xl bg-white shadow-sm text-sm"
            />
            <div className="absolute right-1 top-1 flex gap-1">
              <Button
                size="icon"
                variant={isListening ? "destructive" : "ghost"}
                className={`h-10 w-10 rounded-lg transition-all ${isListening
                  ? 'animate-pulse bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-primary'
                  }`}
                onClick={startListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-lg shadow-md shadow-primary/20"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
