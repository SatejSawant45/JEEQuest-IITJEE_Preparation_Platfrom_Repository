import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollAreaRef = useRef(null)
  const abortControllerRef = useRef(null)

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    setIsStreaming(true)

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch(`${primaryBackendUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No reader available")
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      let done = false
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const jsonStr = line.slice(2)
                const data = JSON.parse(jsonStr)
                if (data.type === "text-delta" && data.textDelta) {
                  setMessages((prev) => {
                    const updated = [...prev]
                    const lastMessage = updated[updated.length - 1]
                    if (lastMessage && lastMessage.role === "assistant") {
                      lastMessage.content += data.textDelta
                    }
                    return updated
                  })
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Chat error:", error)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ])
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl h-[calc(100vh-3rem)] flex flex-col">
        <div className="text-center py-6 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">Ask me anything and I'll help you out!</p>
        </div>

        <Card className="flex-1 flex flex-col shadow-sm border border-gray-200 bg-white overflow-hidden">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12 mt-10">
                  <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                    <Bot className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-500 font-medium">Start a conversation with your AI assistant</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 items-end ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 bg-gray-100 border border-gray-200">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-gray-700" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100/80 text-gray-800 border border-gray-100"
                      }`}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 bg-gray-200">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-gray-700" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex gap-3 justify-start items-end">
                  <Avatar className="h-8 w-8 bg-gray-100 border border-gray-200">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-gray-700" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100/80 rounded-2xl px-4 py-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-gray-600 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-gray-100 bg-gray-50/50 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 bg-white border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />

              {isStreaming ? (
                <Button type="button" onClick={handleStop} variant="outline" size="icon" className="shrink-0 border-gray-200">
                  <div className="h-3 w-3 bg-red-500 rounded-sm" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Press Enter to send your message
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
