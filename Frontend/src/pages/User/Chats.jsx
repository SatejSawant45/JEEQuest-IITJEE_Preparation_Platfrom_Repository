import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Video, MoreVertical, Send, Smile, Paperclip } from "lucide-react";
import { SocketContext } from "@/context/socket";
import { useParams, useNavigate } from "react-router-dom";

export default function ChatPage() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { adminId } = useParams();
  const userId = localStorage.getItem("id"); // ✅ get user id
  const userName = localStorage.getItem("name") || "Student";
  console.log(userId);
  console.log(adminId);
  const cleanAdminId = adminId.replace(/^:/, "");  // Remove leading colon
  const roomId = `${cleanAdminId}_${userId}`;
  console.log(`clean admin id ${cleanAdminId}`)
  console.log(roomId);


  const [admin, setAdmin] = useState({ name: "Loading...", avatar: "/placeholder.svg", isOnline: true });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isCallInitiating, setIsCallInitiating] = useState(false);
  const bottomRef = useRef(null);
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
  // ✅ Join room and fetch old messages
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join_room", roomId);
    console.log("🔗 Joined room:", roomId);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${primaryBackendUrl}/api/messages/${roomId}`);
        const data = await res.json();
        const formatted = data.map(msg => ({
          ...msg,
          isOwn: msg.senderId === userId
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${primaryBackendUrl}/api/admin/${cleanAdminId}`);
        const data = await res.json();
        console.log(data);
        setAdmin({
          name: data.name,
          avatar: data.avatar || "/placeholder.svg",
          isOnline: true // fake for now
        });
      } catch (err) {
        console.error("Failed to fetch Admin info", err);
      }
    };

    fetchMessages();
    fetchAdmin();
  }, [roomId]);

  // ✅ Scroll to bottom on message change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Listen to socket for new message
  useEffect(() => {
    socket.on("receive_message", (message) => {
      console.log("Received:", message);
      setMessages(prev => [...prev, { ...message, isOwn: false }]);
    });

    // Listen for call responses
    socket.on("call_accepted", ({ adminId, roomId: callRoomId }) => {
      console.log("Call accepted by admin:", adminId);
      setIsCallInitiating(false);
      // Navigate to video call page
      navigate(`/videocall/${callRoomId}`);
    });

    socket.on("call_rejected", ({ adminId }) => {
      console.log("Call rejected by admin:", adminId);
      setIsCallInitiating(false);
      alert("Admin declined your call");
    });

    socket.on("call_failed", ({ message }) => {
      console.log("Call failed:", message);
      setIsCallInitiating(false);
      alert(message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_failed");
    };
  }, [socket, navigate]);

  // ✅ Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      room: roomId,
      content: newMessage,
      senderId: userId,
      senderRole: "user",
      timestamp: new Date().toISOString()
    };

    console.log(msg);

    setMessages(prev => [...prev, { ...msg, isOwn: true }]);
    socket.emit("send_message", msg);
    setNewMessage("");
  };

  // ✅ Initiate video call
  const handleVideoCall = () => {
    if (isCallInitiating) return;

    setIsCallInitiating(true);
    const callRoomId = `call_${cleanAdminId}_${userId}_${Date.now()}`;

    console.log("Initiating call to admin:", cleanAdminId);
    socket.emit("initiate_call", {
      studentId: userId,
      adminId: cleanAdminId,
      roomId: callRoomId,
      studentName: userName
    });

    // Set timeout for no answer (30 seconds)
    setTimeout(() => {
      if (isCallInitiating) {
        setIsCallInitiating(false);
        alert("Admin did not respond to your call");
      }
    }, 30000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl h-[calc(100vh-3rem)] flex flex-col">
        {/* Page Title Header */}
        <div className="text-center py-6 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Chat</h1>
          <p className="text-gray-600">Connect directly with {admin.name}</p>
        </div>

        <Card className="flex-1 flex flex-col shadow-sm border border-gray-200 bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-gray-100">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                  {admin.name?.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-900 leading-tight">{admin.name}</h2>
                <div className="flex items-center mt-0.5">
                  <span className={`h-2 w-2 rounded-full mr-1.5 ${admin.isOnline ? "bg-green-500" : "bg-gray-300"}`}></span>
                  <p className="text-xs text-gray-500 font-medium">{admin.isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVideoCall}
                disabled={isCallInitiating}
                title={isCallInitiating ? "Calling..." : "Start video call"}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <Video className={`h-5 w-5 ${isCallInitiating ? "animate-pulse text-green-600" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12 mt-10">
                  <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={admin.avatar} alt={admin.name} />
                      <AvatarFallback className="bg-gray-200 text-gray-600 font-medium">
                        {admin.name?.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-gray-500 font-medium">Send a message to start chatting</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 items-end ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.isOwn ? "bg-gray-900 text-white" : "bg-gray-100/80 text-gray-800 border border-gray-100"}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.isOwn ? "text-gray-300" : "text-gray-400"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>
          </ScrollArea>

          {/* Input box */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <Button type="button" variant="ghost" size="icon" className="shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-200">
                <Paperclip className="h-5 w-5" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="pr-10 bg-white border border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-900 w-full"
                />
                <Button variant="ghost" size="icon" type="button" className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim()}
                className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
