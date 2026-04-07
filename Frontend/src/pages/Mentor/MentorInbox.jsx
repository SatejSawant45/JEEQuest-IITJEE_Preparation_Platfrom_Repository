import React, { useEffect, useState, useContext } from "react";
import MentorSidebar from "@/components/MentorSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, PhoneMissed, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import IncomingCallDialog from "../IncommingVideoCall";
import IncomingCallPopup from "@/components/IncomingCallPopup";
import { SocketContext } from "@/context/socket";

export default function MentorInbox() {
  const socket = useContext(SocketContext);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [userId, setUserId] = useState(null); // ✅ track selected userId
  const [incomingCall, setIncomingCall] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [missedCalls, setMissedCalls] = useState([]);
  const [activeTab, setActiveTab] = useState("messages");

  const mentorId = localStorage.getItem("id");
  const navigate = useNavigate();

  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;

  useEffect(() => {
    if (mentorId && socket) {
      console.log("📡 Registering mentor with socket...", mentorId);
      console.log("Socket connected:", socket.connected);
      
      // Wait for socket to connect if not already connected
      if (!socket.connected) {
        socket.on("connect", () => {
          console.log("✅ Socket connected, registering mentor:", mentorId);
          socket.emit("register", { userId: mentorId, userRole: "mentor" });
        });
      } else {
        console.log("✅ Mentor registering with socket:", mentorId);
        socket.emit("register", { userId: mentorId, userRole: "mentor" });
      }
    }

    // Fetch call history and missed calls
    fetchCallHistory();
    fetchMissedCalls();
  }, [mentorId, socket]);

  useEffect(() => {
    fetch(`${primaryBackendUrl}/api/mentor/conversations`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (data.length > 0) {
          setActiveConversation(data[0]);
          setUserId(data[0].userId); // ✅ Store userId from existing convo
        } else {
          fetch(`${primaryBackendUrl}/api/mentor/users`)
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

      fetch(`${primaryBackendUrl}/api/messages/${activeConversation.roomId}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === mentorId
          })));
        })
        .catch(err => console.error("Failed to load messages", err));
    }
  }, [activeConversation, mentorId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages(prev => [...prev, { ...data, isOwn: false }]);
    });

    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    socket.on("incoming_call", ({ studentId, roomId, studentName, callTime }) => {
      console.log("📞 Incoming call from:", studentName);
      setIncomingCall({ studentId, roomId, studentName, callTime });
    });

    return () => {
      socket.off("incoming_call");
    };
  }, [socket]);

  const fetchCallHistory = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/videocalls/mentor/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCallHistory(data.calls);
      }
    } catch (error) {
      console.error("Error fetching call history:", error);
    }
  };

  const fetchMissedCalls = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(`${primaryBackendUrl}/api/videocalls/mentor/missed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMissedCalls(data.missedCalls);
      }
    } catch (error) {
      console.error("Error fetching missed calls:", error);
    }
  };

  const handleAcceptCall = () => {
    if (!incomingCall) return;

    console.log("Accepting call from:", incomingCall.studentName);
    
    socket.emit("accept_call", {
      studentId: incomingCall.studentId,
      adminId: mentorId,
      adminModel: "Mentor",
      roomId: incomingCall.roomId,
    });

    // Navigate to video call
    navigate(`/mentor/videocall/${incomingCall.roomId}`);
    setIncomingCall(null);
  };

  const handleRejectCall = () => {
    if (!incomingCall) return;

    console.log("Rejecting call from:", incomingCall.studentName);
    
    socket.emit("reject_call", {
      studentId: incomingCall.studentId,
      adminId: mentorId,
      adminModel: "Mentor",
      roomId: incomingCall.roomId,
    });

    setIncomingCall(null);
    // Refresh call lists
    fetchCallHistory();
    fetchMissedCalls();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      room: activeConversation.roomId,
      senderId: mentorId,
      senderRole: "mentor",
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    socket.emit("send_message", message);
    setMessages(prev => [...prev, { ...message, isOwn: true }]);
    setNewMessage("");
  };

  const handleVideoCall = () => {
  if (!mentorId || !userId) return;

  const roomId = `mentor_${userId}`;
  const adminName = localStorage.getItem("name") || "Mentor";

  // 🔴 Emit call to user
  socket.emit("call_user", {
    fromAdminId: mentorId,
    toUserId: userId,
    roomId,
    adminName,
    adminModel: "Mentor",
  });

  // ✅ Then navigate
  navigate(`/mentor/videocall/${roomId}`);
};

  const filteredConversations = conversations.filter((conv) =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <MentorSidebar />
      <div className="flex-1 ml-64 flex">
      {/* Incoming Call Popup */}
      <IncomingCallPopup
        call={incomingCall}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />

      {/* Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold mb-3">Mentor Inbox</h1>
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

        {/* Tabs for Messages, Call History, Missed Calls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="calls">
              Calls
              {callHistory.length > 0 && (
                <Badge variant="secondary" className="ml-1">{callHistory.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="missed">
              Missed
              {missedCalls.length > 0 && (
                <Badge variant="destructive" className="ml-1">{missedCalls.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {conversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.roomId}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                        activeConversation?.roomId === conversation.roomId ? "bg-accent" : ""
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation);
                        setUserId(conversation.userId);
                      }}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={conversation.userName} />
                        <AvatarFallback>
                          {conversation.userName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
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
                  filteredUsers.map((user) => {
                    const roomId = `mentor_${user._id}`;
                    return (
                      <div
                        key={user._id}
                        className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          const newConversation = {
                            roomId,
                            userName: user.name,
                            userId: user._id,
                            unreadCount: 0,
                            lastMessage: "",
                            lastMessageTime: "",
                          };
                          setActiveConversation(newConversation);
                          setUserId(user._id);
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
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="calls" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {callHistory.length > 0 ? (
                  callHistory.map((call) => (
                    <div
                      key={call._id}
                      className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors mb-2"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {call.student?.name?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{call.student?.name || "Unknown"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <PhoneIncoming className="h-3 w-3" />
                          <span className="capitalize">{call.status}</span>
                          <span>•</span>
                          <span>{new Date(call.createdAt).toLocaleDateString()}</span>
                        </div>
                        {call.duration > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Duration: {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, "0")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PhoneIncoming className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No call history</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="missed" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="p-2">
                {missedCalls.length > 0 ? (
                  missedCalls.map((call) => (
                    <div
                      key={call._id}
                      className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors mb-2 border-l-4 border-red-500"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-red-100 text-red-700">
                          {call.student?.name?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{call.student?.name || "Unknown"}</p>
                        <div className="flex items-center gap-2 text-xs text-red-600">
                          <PhoneMissed className="h-3 w-3" />
                          <span>Missed call</span>
                          <span>•</span>
                          <span>{new Date(call.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(call.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <PhoneMissed className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No missed calls</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
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
                  <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
          <div className="text-center py-8 text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
