"use client"

import { Card, CardContent } from "@/components/ui/card"
import { History, CheckCircle2, Clock, ChevronRight } from "lucide-react"

interface HistoryItem {
  id: number;
  name: string;
  date: string;
  amount: string;
  status: "Completed" | "Paid" | string;
  type: "initiated" | "member" | string;
}

export default function HistoryPage() {
  const history: HistoryItem[] = []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground">Billing History</h1>
      </div>

      <div className="space-y-3">
        {history.length > 0 ? (
          history.map((item) => (
            <Card key={item.id} className="border-border shadow-sm overflow-hidden active:bg-muted transition-colors cursor-pointer rounded-lg">
              <CardContent className="p-0 flex">
                <div className={`w-1.5 ${item.status === "Completed" ? "bg-primary" : "bg-orange-500"}`}></div>
                <div className="p-4 flex-1 flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      <span>{item.date}</span>
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
    </div>
  )
}
