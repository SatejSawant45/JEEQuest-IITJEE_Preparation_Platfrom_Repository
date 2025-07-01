import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:7000");

export default function AdminInbox() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/conversations")
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (data.length > 0) {
          setActiveConversation(data[0]);
        } else {
          fetch("http://localhost:5000/api/admin/users")
            .then(res => res.json())
            .then(users => setAllUsers(users))
            .catch(err => console.error("Failed to load users", err));
        }
      })
      .catch(err => console.error("Failed to load conversations", err));
  }, []);

  useEffect(() => {
    if (activeConversation) {
      socket.emit("join_room", activeConversation.roomId);

      fetch(`http://localhost:5000/api/messages/${activeConversation.roomId}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data.map(msg => ({
            ...msg,
            isOwn: msg.senderId === "admin"
          })));
        })
        .catch(err => console.error("Failed to load messages", err));
    }
  }, [activeConversation]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, { ...data, isOwn: false }]);
    });

    return () => socket.off("receive_message");
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      roomId: activeConversation.roomId,
      senderId: "admin",
      content: newMessage,
    };

    socket.emit("send_message", message);
    setMessages(prev => [
      ...prev,
      {
        ...message,
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


                    const { userId } = useParams();
                    const adminId = localStorage.getItem("id"); // ✅ get admin id
                    console.log(userId);
                    console.log(adminId);
                    // const Id = mentorId.replace(/^:/, "");

  return (
    <div className="flex h-screen bg-background">
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-3">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.roomId}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                    activeConversation?.roomId === conversation.roomId ? "bg-accent" : ""
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" alt={conversation.userName} />
                      <AvatarFallback>
                        {conversation.userName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{conversation.userName}</p>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => {
                    const newConversation = {
                      roomId: `${adminId}_${userId}`,
                      userName: user.name,
                      unreadCount: 0,
                      lastMessage: "",
                      lastMessageTime: "",
                    };
                    setActiveConversation(newConversation);
                    setConversations((prev) => [...prev, newConversation]);
                  }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Start a new chat</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={activeConversation.userName} />
                    <AvatarFallback>
                      {activeConversation.userName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">{activeConversation.userName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {activeConversation.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {msg.timestamp || ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

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
                  <Button variant="ghost" size="icon" type="button" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
