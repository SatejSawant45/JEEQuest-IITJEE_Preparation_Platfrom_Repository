import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={admin.avatar} alt={admin.name} />
            <AvatarFallback>{admin.name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{admin.name}</h2>
            <p className="text-sm text-gray-500">{admin.isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleVideoCall}
            disabled={isCallInitiating}
            title={isCallInitiating ? "Calling..." : "Start video call"}
          >
            <Video className={`h-5 w-5 ${isCallInitiating ? "animate-pulse text-green-600" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
      </ScrollArea>

      {/* Input box */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
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
          <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
}
