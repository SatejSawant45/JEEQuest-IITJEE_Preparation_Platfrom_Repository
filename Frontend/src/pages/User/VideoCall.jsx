"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Camera, CameraOff, MessageSquare, Mic, MicOff, PhoneOff } from "lucide-react"
import socket from "@/context/socket"

export default function VideoCall() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const callStartTimeRef = useRef(Date.now())

  const handleEndCall = (skipEmit = false) => {
    // Clean up media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (!skipEmit) {
      // Calculate call duration
      const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000)
      
      // Parse roomId to get studentId and adminId
      // roomId format: call_adminId_studentId_timestamp
      const parts = roomId.split('_')
      const adminId = parts[1]
      const studentId = parts[2]
      
      // Emit end_call event
      socket.emit('end_call', { roomId, duration, studentId, adminId })
    }
    
    // Navigate to user dashboard
    navigate('/user/dashboard')
  }

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Student initializing call, roomId:", roomId)
        console.log("Socket connected:", socket.connected)
        console.log("Socket ID:", socket.id)
        
        // Ensure socket is connected
        if (!socket.connected) {
          console.log("Socket not connected, waiting...")
          await new Promise((resolve) => {
            socket.on('connect', () => {
              console.log("Socket connected!")
              resolve()
            })
            if (socket.connected) resolve()
          })
        }
        
        // Get media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
        console.log("Student: Local stream obtained")

        // Join room and wait for confirmation
        socket.emit("join_room", roomId)
        console.log("Student: Emitted join_room for", roomId)
        
        await new Promise((resolve) => {
          socket.once("room_joined", ({ roomId: joinedRoom, success }) => {
            console.log("Student: Room joined confirmation", joinedRoom, success)
            resolve()
          })
        })

        console.log("Student: Confirmed in room, setting up WebRTC...")

        // Setup WebRTC peer connection
        const peer = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            // Add TURN server here if needed
          ],
        })

        peerConnectionRef.current = peer

        // Add tracks
        stream.getTracks().forEach((track) => {
          console.log("Student: Adding track", track.kind)
          peer.addTrack(track, stream)
        })

        // Handle remote track
        peer.ontrack = (event) => {
          console.log("Student: Received remote track", event.streams[0])
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Send ICE candidates
        peer.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Student: Sending ICE candidate")
            socket.emit("ice_candidate", { roomId, candidate: event.candidate })
          }
        }

        // Handle offer/answer
        socket.on("webrtc_offer", async ({ offer }) => {
          console.log("Student: Received offer (shouldn't happen - student creates offer)")
          await peer.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await peer.createAnswer()
          await peer.setLocalDescription(answer)
          socket.emit("webrtc_answer", { roomId, answer })
        })

        socket.on("webrtc_answer", async ({ answer }) => {
          console.log("Student: Received answer from admin")
          await peer.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on("ice_candidate", async ({ candidate }) => {
          if (candidate) {
            console.log("Student: Received ICE candidate")
            try {
              await peer.addIceCandidate(new RTCIceCandidate(candidate))
            } catch (err) {
              console.error("Failed to add ICE Candidate:", err)
            }
          }
        })

        socket.on("call_ended", () => {
          console.log("Call ended by other party")
          handleEndCall(true)
        })

        // Initiate call (offer) - Student creates the offer
        console.log("Student: Creating and sending offer")
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        socket.emit("webrtc_offer", { roomId, offer })
        console.log("Student: Offer sent")
      } catch (err) {
        console.error("Error accessing media:", err)
      }
    }

    init()

    return () => {
      socket.off("webrtc_offer")
      socket.off("webrtc_answer")
      socket.off("ice_candidate")
      socket.off("call_ended")
      socket.emit("leave_room", roomId)
      peerConnectionRef.current?.close()
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [roomId, navigate])

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const msg = {
        sender: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString(),
      }
      setChatMessages((prev) => [...prev, msg])
      setNewMessage("")
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-900 font-medium">Video Call Room: {roomId}</span>
        </div>
        <div className="text-gray-600 text-sm">{new Date().toLocaleTimeString()}</div>
      </div>

      {/* Video Streams */}
      <div className="flex-1 p-6">
        <div className="h-full flex gap-6">
          {/* Remote Video */}
          <Card className="flex-1 shadow-lg">
            <CardContent className="p-0 h-full relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg"
              ></video>
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded shadow">Remote User</div>
            </CardContent>
          </Card>

          {/* Local Video */}
          <div className="w-80">
            <Card className="h-60 shadow-lg">
              <CardContent className="p-0 h-full relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                ></video>
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow">You</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <Sheet open={showChat} onOpenChange={setShowChat}>
        <SheetContent side="right" className="w-80 bg-white">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full mt-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm bg-gray-100 px-3 py-2 rounded">{msg.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Controls */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            onClick={() => {
              const stream = localStreamRef.current
              stream?.getAudioTracks().forEach((track) => (track.enabled = isMuted))
              setIsMuted((prev) => !prev)
            }}
            className="h-14 w-14 rounded-full"
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant={!isCameraOn ? "destructive" : "secondary"}
            onClick={() => {
              const stream = localStreamRef.current
              stream?.getVideoTracks().forEach((track) => (track.enabled = !isCameraOn))
              setIsCameraOn((prev) => !prev)
            }}
            className="h-14 w-14 rounded-full"
          >
            {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowChat(true)}
            className="h-14 w-14 rounded-full"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          <Button
            variant="destructive"
            className="h-14 w-14 rounded-full"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
