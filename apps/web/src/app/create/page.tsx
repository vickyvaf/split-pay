"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Trash2,
  Users,
  Receipt,
  Camera,
  PenLine,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  ChevronRight,
  Aperture,
  MessageSquare,
  Zap,
  Mic,
  MicOff
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { StaticImageData } from "next/image"
import scene1 from "@/assets/image-scene-1.jpg"
import scene2 from "@/assets/image-scene-2.jpg"
import scene3 from "@/assets/image-scene-3.jpg"

interface CarouselItem {
  image: string | StaticImageData;
  title: string;
  label: string;
}

export default function CreateBill() {
  const [mode, setMode] = useState<"choice" | "manual" | "scan" | "ai">("choice")
  const [groupName, setGroupName] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [members, setMembers] = useState([{ name: "", address: "" }])
  const [scanStep, setScanStep] = useState<"upload" | "processing" | "result">("upload")
  const [activeSlide, setActiveSlide] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [autoStartVoice, setAutoStartVoice] = useState(false)
  const router = useRouter()

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
      setGroupName(prev => prev ? `${prev} ${transcript}` : transcript)
    }

    recognition.start()
  }

  const carouselItems: CarouselItem[] = [
    {
      image: scene1,
      title: "Simplify Every Moment",
      label: "MINIPAY UTILITY"
    },
    {
      image: scene2,
      title: "Split Bills Instantly",
      label: "SEAMLESS PAYMENTS"
    },
    {
      image: scene3,
      title: "Focus on the Fun",
      label: "GROUP DYNAMICS"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carouselItems.length])

  useEffect(() => {
    if (mode === "ai" && autoStartVoice) {
      const timer = setTimeout(() => {
        startListening()
        setAutoStartVoice(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [mode, autoStartVoice])

  useEffect(() => {
    if (scanStep === "processing") {
      const timer = setTimeout(() => {
        // Mock transition but with empty data for user testing
        setScanStep("result")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [scanStep])

  const addMember = () => {
    setMembers([...members, { name: "", address: "" }])
  }

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index))
  }

  const updateMember = (index: number, field: "name" | "address", value: string) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  const splitAmount = totalAmount ? (parseFloat(totalAmount) / (members.length + 1)).toFixed(2) : "0.00"

  const handleCreateBill = () => {
    setIsCreating(true)
    // Simulate API call
    setTimeout(() => {
      router.push("/history")
    }, 1500)
  }

  // 1. Choice View (Matches Screenshot)
  if (mode === "choice") {
    return (
      <div className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Choose your method</h1>
          <p className="text-muted-foreground text-sm">How would you like to add the expenses?</p>
        </div>

        <div className="grid gap-4 relative z-20">
          {/* Scan Receipt */}
          <div
            role="button"
            onClick={() => {
              setMode("scan")
              setScanStep("upload")
            }}
            className="group flex items-center gap-4 bg-primary/5 p-4 rounded-xl shadow-sm border border-primary/20 transition-all active:scale-[0.98] cursor-pointer relative z-30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <Aperture className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground text-sm">Scan receipt</h3>
              <p className="text-xs text-muted-foreground">Instant OCR detection from photo</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Type with AI */}
          <div
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-border transition-all overflow-hidden relative z-30"
          >
            <div
              role="button"
              onClick={() => {
                setMode("ai")
                setScanStep("upload")
              }}
              className="flex items-center gap-4 p-4 active:scale-[0.98] cursor-pointer"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/30 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-foreground text-sm">Type with AI</h3>
                <p className="text-xs text-muted-foreground">Describe your bill or chat with AI</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex border-t border-border/50">
              <button
                onClick={() => {
                  setMode("ai")
                  setScanStep("upload")
                }}
                className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="h-3 w-3" />
                Chat AI
              </button>
              <div className="w-[1px] bg-border/50" />
              <button
                onClick={() => {
                  setMode("ai")
                  setScanStep("upload")
                  setAutoStartVoice(true)
                }}
                className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5"
              >
                <Mic className="h-3 w-3" />
                Voice
              </button>
            </div>
          </div>

          {/* Fill manually */}
          <div
            role="button"
            onClick={() => setMode("manual")}
            className="group flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-border transition-all active:scale-[0.98] cursor-pointer relative z-30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/30 text-primary">
              <PenLine className="h-6 w-6" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-foreground text-sm">Fill manually</h3>
              <p className="text-xs text-muted-foreground">Enter line items one by one</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Promo Card aligned with AI Callout style */}
        <Card className="bg-secondary/30 border-dashed border-primary/30 rounded-xl">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="text-primary mt-0.5">
              <Zap className="h-5 w-5 fill-primary/20" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Fast Settlements</p>
              <p className="text-xs text-muted-foreground">Settle up instantly with zero fees within the MiniPay ecosystem.</p>
            </div>
          </CardContent>
        </Card>

        {/* Featured Carousel */}
        <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-md group">
          {carouselItems.map((item, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              <img
                src={typeof item.image === 'string' ? item.image : item.image.src}
                alt={item.title}
                className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${idx === activeSlide ? 'scale-110' : 'scale-100'
                  }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-0.5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{item.label}</p>
                <h2 className="text-xl font-bold tracking-tight">{item.title}</h2>
              </div>
            </div>
          ))}

          {/* Progress Indicators */}
          <div className="absolute top-4 right-4 flex gap-1.5 z-20">
            {carouselItems.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${idx === activeSlide ? 'w-4 bg-primary' : 'w-1.5 bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }


  // 2. Scan View
  if (mode === "scan") {
    return (
      <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <button
          onClick={() => setMode("choice")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Options
        </button>

        {scanStep === "upload" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Snap Receipt</h1>
              <p className="text-muted-foreground text-sm">Place your receipt on a flat surface</p>
            </div>

            <div className="grid gap-4">
              <div
                className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-12 text-center transition-all hover:border-primary hover:bg-primary/10 active:scale-[0.98]"
              >
                <div className="flex flex-col items-center gap-4 pointer-events-none">
                  <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                    <Camera className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">Use Camera</p>
                    <p className="text-xs text-muted-foreground">Take a photo now</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="receipt-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setScanStep("processing")
                    }
                  }}
                />
              </div>

              <div
                className="group relative cursor-pointer flex items-center gap-4 rounded-xl border border-border bg-white p-4 transition-all active:scale-[0.98]"
              >
                <div className="h-10 w-10 rounded-xl bg-secondary/30 flex items-center justify-center text-primary pointer-events-none">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-sm font-bold pointer-events-none">Choose from Gallery</div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 pointer-events-none" />
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="gallery-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setScanStep("processing")
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {scanStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold tracking-tight">AI is Thinking...</h3>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Extracting items and calculating total</p>
                <div className="flex justify-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        )}

        {scanStep === "result" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <CheckCircle2 className="h-32 w-32" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Scan Successful</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">45.50</span>
                    <span className="text-sm font-bold opacity-80 uppercase">cUSD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Group Name</Label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-12 rounded-xl bg-white border-border focus:border-primary font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Total Amount (cUSD)</Label>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="h-12 rounded-xl bg-white border-border focus:border-primary font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                className="w-full rounded-xl text-sm font-bold shadow-md shadow-primary/20 h-12"
                onClick={() => setMode("manual")}
              >
                Next: Add Participants
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground font-bold text-xs"
                onClick={() => setScanStep("upload")}
              >
                Retake Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 3. Type with AI View
  if (mode === "ai") {
    return (
      <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
        <button
          onClick={() => setMode("choice")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Options
        </button>

        {scanStep === "upload" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Type with AI</h1>
              <p className="text-muted-foreground text-sm">Describe your bill or paste the text here</p>
            </div>

            <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-white p-4 relative">
              <textarea
                className="w-full h-40 bg-muted/20 border-none focus:ring-0 resize-none p-4 rounded-lg text-sm"
                placeholder="Example: I paid for dinner at Kemang yesterday, total was 45.50 cUSD for 3 people..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <div className="absolute bottom-6 right-6">
                <Button
                  size="icon"
                  variant={isListening ? "destructive" : "secondary"}
                  className={`h-12 w-12 rounded-full shadow-lg transition-all ${isListening ? 'animate-pulse scale-110' : 'hover:scale-105'}`}
                  onClick={startListening}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>
            </Card>

            <Button
              className="w-full rounded-xl text-sm font-bold shadow-md shadow-primary/20 h-12"
              onClick={() => setScanStep("processing")}
            >
              Analyze with AI
            </Button>
          </div>
        )}

        {scanStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-foreground">AI is Reading...</h3>
              <p className="text-sm text-muted-foreground">Extracting bill details from your text</p>
            </div>
          </div>
        )}

        {scanStep === "result" && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <CheckCircle2 className="h-32 w-32" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">AI Extraction Success</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">45.50</span>
                    <span className="text-sm font-bold opacity-80 uppercase">cUSD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Detected Name</Label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-12 rounded-xl bg-white border-border focus:border-primary font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Detected Amount (cUSD)</Label>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="h-12 rounded-xl bg-white border-border focus:border-primary font-bold text-lg"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                className="w-full rounded-xl text-sm font-bold shadow-md shadow-primary/20 h-12"
                onClick={() => setMode("manual")}
              >
                Confirm & Continue
              </Button>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground font-bold text-xs"
                onClick={() => setScanStep("upload")}
              >
                Edit Text
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 4. Manual Entry View (Original Form)
  return (
    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMode("choice")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Options
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Bill Details</h1>
        <p className="text-muted-foreground text-sm">Enter group info and participants</p>
      </div>

      <Card className="border-border shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-xs font-bold text-muted-foreground ml-1">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g. Dinner Jakarta"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-muted/10 border-border focus:border-primary rounded-xl h-11 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount" className="text-xs font-bold text-muted-foreground ml-1">Total Amount (cUSD)</Label>
            <Input
              id="totalAmount"
              type="number"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-muted/10 border-border focus:border-primary rounded-xl h-12 font-bold text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            Participants
          </h2>
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {members.length + 1} People
          </span>
        </div>

        <div className="space-y-3">
          {/* Initiator (Implicit) */}
          <Card className="border-primary/20 bg-primary/5 border-dashed rounded-xl overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-bold shadow-md shadow-primary/20">
                  ME
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">You (Initiator)</p>
                  <p className="text-[10px] text-muted-foreground">Will receive payments</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">{splitAmount} cUSD</span>
              </div>
            </CardContent>
          </Card>

          {members.map((member, index) => (
            <Card key={index} className="border-border shadow-sm rounded-lg overflow-hidden bg-white">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-secondary/30 text-primary flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Friend's Name"
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    className="h-9 text-sm border-none bg-muted/10 focus-visible:ring-1 rounded-lg"
                  />
                </div>
                <div className="text-right flex items-center gap-2">
                  <div className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">{splitAmount}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-all active:scale-90"
                    onClick={() => removeMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full border-2 border-dashed border-primary/20 text-primary bg-transparent hover:bg-primary/5 hover:text-primary hover:border-primary/40 active:bg-primary/10 rounded-xl text-xs font-bold transition-all h-12"
            onClick={addMember}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
      </div>

      <div className="pt-4 pb-10">
        <Button
          className="w-full rounded-xl text-sm font-bold shadow-lg shadow-primary/25 active:scale-[0.99] transition-transform h-12"
          onClick={handleCreateBill}
          disabled={isCreating || !groupName || !totalAmount}
        >
          {isCreating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating...</span>
            </div>
          ) : "Create Bill & Get Links"}
        </Button>
      </div>
    </div>
  )
}

