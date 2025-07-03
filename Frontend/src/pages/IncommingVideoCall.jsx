import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Phone, PhoneOff, MessageSquare } from "lucide-react"

export default function IncomingCallDialog({
  isOpen,
  onAccept,
  onDecline,
  onMessage,
  callerName,
  callerAvatar,
  callerTitle = "Incoming call",
}) {
  const [ripples, setRipples] = useState([])

  // Create ripple animation effect
  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setRipples((prev) => {
        const newRipples = [...prev, Date.now()]
        return newRipples.slice(-3) // Keep only the last 3 ripples
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [isOpen])

  // Clean up ripples when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setRipples([])
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-2xl">
        <div className="flex flex-col items-center text-center p-6 space-y-6">
          {/* Caller Avatar with Ripple Effect */}
          <div className="relative">
            {ripples.map((ripple, index) => (
              <div
                key={ripple}
                className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: "2s",
                }}
              />
            ))}

            <div className="relative z-10 p-1 bg-white rounded-full shadow-lg">
              <Avatar className="h-24 w-24">
                <AvatarImage src={callerAvatar || "/placeholder.svg?height=96&width=96"} />
                <AvatarFallback className="text-2xl bg-blue-200 text-blue-800">
                  {callerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Caller Info */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">{callerTitle}</p>
            <h2 className="text-2xl font-bold text-gray-900">{callerName}</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Calling...</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <Button
              variant="destructive"
              size="lg"
              onClick={onDecline}
              className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            {onMessage && (
              <Button
                variant="outline"
                size="lg"
                onClick={onMessage}
                className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="default"
              size="lg"
              onClick={onAccept}
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
            <span>Swipe up for more options</span>
          </div>
        </div>

        {/* Subtle background animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse" />
          <div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
