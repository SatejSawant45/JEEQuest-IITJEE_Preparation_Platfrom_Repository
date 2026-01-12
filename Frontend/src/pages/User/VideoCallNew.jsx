import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react"
import socket from "@/context/socket"

export default function VideoCall() {
  const { roomId } = useParams()
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [remoteConnected, setRemoteConnected] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const hasCreatedOffer = useRef(false)
  const remoteStreamSetRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const setupCall = async () => {
      try {
        console.log("=== STUDENT: Starting setup ===")
        console.log("Room ID:", roomId)
        console.log("Socket connected:", socket.connected)
        console.log("Socket ID:", socket.id)

        // Get local media - try video first, fallback to audio only
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          })
          console.log("✓ Local media obtained (video + audio)")
        } catch (videoErr) {
          console.warn("Video failed, trying audio only:", videoErr.message)
          // Fallback to audio only if video fails (camera in use)
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          })
          console.log("✓ Local media obtained (audio only)")
        }

        if (!mounted) return

        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Join room
        socket.emit("join_room", roomId)
        console.log("✓ Join room emitted")

        // Create peer connection
        const config = {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" }
          ]
        }
        const peer = new RTCPeerConnection(config)
        peerConnectionRef.current = peer
        console.log("✓ Peer connection created")

        // Add local tracks to peer
        console.log("Student: Adding tracks to peer connection...")
        console.log("Student: Stream has", stream.getTracks().length, "tracks")
        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream)
          console.log(`✓ Added ${track.kind} track - enabled: ${track.enabled}, muted: ${track.muted}, readyState: ${track.readyState}`)
        })

        // Handle incoming tracks
        peer.ontrack = (event) => {
          console.log("✓✓✓ STUDENT: RECEIVED REMOTE TRACK:", event.track.kind)
          console.log("Track kind:", event.track.kind)
          console.log("Stream tracks:", event.streams[0].getTracks().map(t => `${t.kind}: ${t.enabled}`))
          
          // Only set srcObject once, not on every track
          if (remoteVideoRef.current && event.streams[0] && !remoteStreamSetRef.current) {
            remoteStreamSetRef.current = true
            remoteVideoRef.current.srcObject = event.streams[0]
            console.log("✓ Remote video element srcObject set (ONCE)")
            setRemoteConnected(true)
          } else if (remoteStreamSetRef.current) {
            console.log("✓ Additional", event.track.kind, "track received, stream already set")
          }
        }

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("→ Sending ICE candidate")
            socket.emit("ice_candidate", { roomId, candidate: event.candidate })
          } else {
            console.log("✓ ICE gathering complete")
          }
        }

        // Monitor connection state
        peer.onconnectionstatechange = () => {
          console.log("Connection state:", peer.connectionState)
        }

        peer.oniceconnectionstatechange = () => {
          console.log("ICE connection state:", peer.iceConnectionState)
        }

        // Handle incoming offer (shouldn't happen for student, but just in case)
        socket.on("webrtc_offer", async ({ offer }) => {
          console.log("← Received OFFER (unexpected for student)")
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await peer.createAnswer()
            await peer.setLocalDescription(answer)
            socket.emit("webrtc_answer", { roomId, answer })
            console.log("→ Sent ANSWER")
          } catch (err) {
            console.error("Error handling offer:", err)
          }
        })

        // Handle incoming answer
        socket.on("webrtc_answer", async ({ answer }) => {
          console.log("← Received ANSWER from admin")
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(answer))
            console.log("✓ Remote description set")
          } catch (err) {
            console.error("Error setting remote description:", err)
          }
        })

        // Handle incoming ICE candidates
        socket.on("ice_candidate", async ({ candidate }) => {
          console.log("← Received ICE candidate")
          try {
            if (candidate) {
              await peer.addIceCandidate(new RTCIceCandidate(candidate))
              console.log("✓ ICE candidate added")
            }
          } catch (err) {
            console.error("Error adding ICE candidate:", err)
          }
        })

        // Wait longer for admin to join and set up their peer connection
        console.log("Student: Waiting for admin to join room...")
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Create and send offer (student initiates)
        if (!hasCreatedOffer.current) {
          hasCreatedOffer.current = true
          console.log("Student: Creating OFFER...")
          const offer = await peer.createOffer()
          await peer.setLocalDescription(offer)
          console.log("→ Sending OFFER to room:", roomId)
          socket.emit("webrtc_offer", { roomId, offer })
          console.log("✓ Offer sent successfully")
        }

      } catch (err) {
        console.error("Setup error:", err)
      }
    }

    setupCall()

    return () => {
      mounted = false
      remoteStreamSetRef.current = false
      hasCreatedOffer.current = false
      console.log("=== STUDENT: Cleanup ===")
      
      // Remove socket listeners
      socket.off("webrtc_offer")
      socket.off("webrtc_answer")
      socket.off("ice_candidate")
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      
      // Stop local tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [roomId])

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsCameraOn(videoTrack.enabled)
      }
    }
  }

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
    window.location.href = "/user/dashboard"
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-white font-semibold">Admin</h2>
            <p className="text-sm text-gray-400">
              {remoteConnected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 relative p-4">
        {/* Remote video (admin) - full screen */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-3xl">AD</AvatarFallback>
                </Avatar>
                <p>Waiting for admin...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local video (student) - picture in picture */}
        <div className="absolute bottom-8 right-8 w-48 h-36 rounded-lg overflow-hidden bg-gray-700 shadow-2xl border-2 border-gray-600">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <Avatar>
                <AvatarFallback>YOU</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 flex justify-center items-center space-x-4">
        <Button
          variant={isMuted ? "destructive" : "outline"}
          onClick={toggleMute}
          className="h-14 w-14 rounded-full"
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          variant={!isCameraOn ? "destructive" : "outline"}
          onClick={toggleCamera}
          className="h-14 w-14 rounded-full"
        >
          {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
        </Button>

        <Button
          variant="destructive"
          className="h-14 w-14 rounded-full"
          onClick={endCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
