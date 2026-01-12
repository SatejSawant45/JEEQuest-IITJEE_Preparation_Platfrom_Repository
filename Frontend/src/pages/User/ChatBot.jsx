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
      const response = await fetch("http://localhost:5000/api/chat", {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">AI Assistant</h1>
          <p className="text-slate-600 dark:text-slate-400">Ask me anything and I'll help you out!</p>
        </div>

        <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">Start a conversation with your AI assistant</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 bg-blue-500">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 bg-slate-500">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 bg-blue-500">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-slate-600 dark:text-slate-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t bg-white/50 dark:bg-slate-800/50 p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />

              {isStreaming ? (
                <Button type="button" onClick={handleStop} variant="outline" size="icon" className="shrink-0">
                  <div className="h-4 w-4 bg-red-500 rounded-sm" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0 bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              Press Enter to send your message
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
