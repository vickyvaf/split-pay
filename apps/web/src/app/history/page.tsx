"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { History, CheckCircle2, Clock, ChevronRight, Users } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

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

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    const savedHistory = localStorage.getItem("billing_history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Billing History</h1>
      </div>

      <div className="space-y-3">
        {history.length > 0 ? (
          history.map((item) => (
            <Card 
              key={item.id} 
              className="border-border shadow-sm overflow-hidden active:bg-muted transition-colors cursor-pointer rounded-lg"
              onClick={() => {
                setSelectedItem(item)
                setIsDetailOpen(true)
              }}
            >
              <CardContent className="p-0 flex">
                <div className={`w-1.5 ${item.status === "Completed" ? "bg-primary" : "bg-orange-500"}`}></div>
                <div className="p-4 flex-1 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <span>
                        {item.date.includes(':') ? item.date : new Date(item.id).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>•</span>
                      <span className={item.type === "initiated" ? "text-primary" : "text-orange-600"}>
                        {item.type === "initiated" ? "You Sent" : "You Paid"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-sm text-foreground">{item.amount} cUSD</p>
                      <div className="flex items-center justify-end gap-1">
                        {item.status === "Completed" ? (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        ) : (
                          <Clock className="h-3 w-3 text-orange-500" />
                        )}
                        <span className={`text-[10px] font-bold uppercase ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 bg-muted/5 rounded-2xl border-2 border-dashed border-border/50">
            <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
              <History className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">No history yet</p>
              <p className="text-xs text-muted-foreground">Your split bills will appear here</p>
            </div>
          </div>
        )}
      </div>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl p-0 overflow-hidden border-none max-h-[90vh]">
          {selectedItem && (
            <div className="flex flex-col h-full bg-white">
              <div className={`h-24 ${selectedItem.status === "Completed" ? "bg-primary" : "bg-orange-500"} p-6 flex items-end relative`}>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />
                <h2 className="text-white text-xl font-bold">{selectedItem.name}</h2>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">{selectedItem.amount} cUSD</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedItem.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {selectedItem.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Participants
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center text-[10px] font-bold">ME</div>
                        <div>
                          <p className="text-xs font-bold">You (Initiator)</p>
                          <p className="text-[10px] text-muted-foreground">Will receive payments</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-primary">
                        {(parseFloat(selectedItem.amount) / ((selectedItem.members?.length || 0) + 1)).toFixed(2)} cUSD
                      </p>
                    </div>

                    {selectedItem.members?.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary/30 text-primary flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
                          <div>
                            <p className="text-xs font-bold">{member.name || "Anonymous"}</p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{member.address || "No address"}</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-foreground">
                          {(parseFloat(selectedItem.amount) / ((selectedItem.members?.length || 0) + 1)).toFixed(2)} cUSD
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">
                    <Clock className="h-3 w-3" />
                    Transaction Details
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Date Created</p>
                      <p className="text-xs font-bold">
                        {selectedItem.date.includes(':') ? selectedItem.date : new Date(selectedItem.id).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Type</p>
                      <p className="text-xs font-bold capitalize">{selectedItem.type}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 pb-8">
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="w-full bg-muted/50 hover:bg-muted py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
