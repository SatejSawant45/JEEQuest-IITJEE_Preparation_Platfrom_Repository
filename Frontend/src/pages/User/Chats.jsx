"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react"

// Mock data for conversations
const conversations = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey! How are you doing?",
    timestamp: "2 min ago",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the help yesterday!",
    timestamp: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can we schedule a meeting?",
    timestamp: "3 hours ago",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Perfect! See you tomorrow.",
    timestamp: "Yesterday",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    name: "Emma Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The project looks great!",
    timestamp: "2 days ago",
    unreadCount: 0,
    isOnline: true,
  },
]

// Mock messages for the active conversation
const mockMessages = [
  {
    id: 1,
    senderId: 1,
    content: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: 2,
    senderId: "me",
    content: "I'm doing great! Just working on some new projects. How about you?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: 3,
    senderId: 1,
    content: "That sounds exciting! I'd love to hear more about what you're working on.",
    timestamp: "10:33 AM",
    isOwn: false,
  },
  {
    id: 4,
    senderId: "me",
    content: "I'm building a chat application with React and Next.js. It's been really fun to work on.",
    timestamp: "10:35 AM",
    isOwn: true,
  },
  {
    id: 5,
    senderId: 1,
    content: "That's awesome! I've been wanting to learn more about React. Maybe you could show me sometime?",
    timestamp: "10:36 AM",
    isOwn: false,
  },
]

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      senderId: "me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                  activeConversation.id === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => setActiveConversation(conversation)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{conversation.name}</p>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.avatar} alt={activeConversation.name} />
                  <AvatarFallback>
                    {activeConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {activeConversation.isOnline && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold">{activeConversation.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {activeConversation.isOnline ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
