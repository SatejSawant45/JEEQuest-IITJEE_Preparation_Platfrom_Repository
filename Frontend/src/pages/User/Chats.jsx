import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Send, Smile, Paperclip } from "lucide-react";
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
  const cleanParamId = adminId.replace(/^:/, "");
  const isMentorChat = cleanParamId.startsWith("mentor_");
  const cleanAdminId = isMentorChat ? cleanParamId.replace("mentor_", "") : cleanParamId;
  const roomId = isMentorChat ? `mentor_${userId}` : `${cleanAdminId}_${userId}`;
  const staffModel = isMentorChat ? "Mentor" : "Admin";
  console.log(`clean admin id ${cleanAdminId}`)
  console.log(roomId);


  const [admin, setAdmin] = useState({ name: "Loading...", avatar: "/placeholder.svg", isOnline: false });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCallInitiating, setIsCallInitiating] = useState(false);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const primaryBackendUrl = import.meta.env.VITE_PRIMARY_BACKEND_URL;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;
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
          isOwn: String(msg.senderId) === String(userId)
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    const fetchAdmin = async () => {
      try {
        const profileEndpoint = isMentorChat
          ? `${primaryBackendUrl}/api/mentor/${cleanAdminId}`
          : `${primaryBackendUrl}/api/admin/${cleanAdminId}`;

        const res = await fetch(profileEndpoint);
        const data = await res.json();
        console.log(data);
        setAdmin({
          name: data.name,
          avatar: data.avatar || "/placeholder.svg",
          isOnline: false
        });
      } catch (err) {
        console.error("Failed to fetch Admin info", err);
      }
    };

    const fetchInitialStatus = async () => {
      try {
        if (!socketUrl) return;
        const response = await fetch(`${socketUrl}/test`);
        if (!response.ok) return;
        const data = await response.json();

        const onlineIds = isMentorChat ? (data.onlineMentors || []) : (data.onlineAdmins || []);
        const isOnline = onlineIds.includes(cleanAdminId);
        setAdmin((prev) => ({ ...prev, isOnline }));
      } catch (err) {
        console.warn("Failed to fetch initial staff status", err);
      }
    };

    fetchMessages();
    fetchAdmin();
    fetchInitialStatus();
  }, [roomId, primaryBackendUrl, socketUrl, isMentorChat, cleanAdminId, userId]);

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

    socket.on("admin_status_changed", ({ adminId: changedAdminId, isOnline }) => {
      if (!isMentorChat && changedAdminId === cleanAdminId) {
        setAdmin((prev) => ({ ...prev, isOnline }));
      }
    });

    socket.on("mentor_status_changed", ({ mentorId, isOnline }) => {
      if (isMentorChat && mentorId === cleanAdminId) {
        setAdmin((prev) => ({ ...prev, isOnline }));
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_failed");
      socket.off("admin_status_changed");
      socket.off("mentor_status_changed");
    };
  }, [socket, navigate, isMentorChat, cleanAdminId]);

  // ✅ Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      room: roomId,
      content: newMessage,
      senderId: userId,
      senderRole: "user",
      messageType: "text",
      imageUrl: "",
      timestamp: new Date().toISOString()
    };

    console.log(msg);

    setMessages(prev => [...prev, { ...msg, isOwn: true }]);
    socket.emit("send_message", msg);
    setNewMessage("");
  };

  const handleAttachmentClick = () => {
    if (uploadingImage) return;
    fileInputRef.current?.click();
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await fetch(`${primaryBackendUrl}/api/messages/upload-image`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.imageUrl) {
        throw new Error(uploadData.message || "Failed to upload image");
      }

      const msg = {
        room: roomId,
        content: file.name,
        senderId: userId,
        senderRole: "user",
        messageType: "image",
        imageUrl: uploadData.imageUrl,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, { ...msg, isOwn: true }]);
      socket.emit("send_message", msg);
    } catch (error) {
      console.error("Image send failed:", error);
      alert(error.message || "Failed to send image");
    } finally {
      setUploadingImage(false);
    }
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
      adminModel: staffModel,
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

  const handleClearChat = async () => {
    const shouldClear = window.confirm("Clear this chat history? This cannot be undone.");
    if (!shouldClear) return;

    try {
      const response = await fetch(`${primaryBackendUrl}/api/messages/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear chat");
      }

      setMessages([]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
      alert("Failed to clear chat. Please try again.");
    }
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClearChat} className="text-red-600 focus:text-red-600">
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {msg.imageUrl ? (
                      <a href={msg.imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={msg.imageUrl}
                          alt={msg.content || "Shared image"}
                          className="max-h-64 w-auto rounded-lg border border-gray-200"
                        />
                      </a>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleAttachmentClick}
                disabled={uploadingImage}
                title={uploadingImage ? "Uploading image..." : "Attach image"}
                className="shrink-0 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
              >
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
