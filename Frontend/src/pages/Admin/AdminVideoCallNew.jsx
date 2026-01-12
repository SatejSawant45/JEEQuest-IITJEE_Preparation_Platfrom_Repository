import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react"
import socket from "@/context/socket"

export default function AdminVideoCall() {
  const { roomId } = useParams()
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [remoteConnected, setRemoteConnected] = useState(false)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const remoteStreamSetRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const setupCall = async () => {
      try {
        console.log("=== ADMIN: Starting setup ===")
        console.log("Room ID:", roomId)
        console.log("Socket connected:", socket.connected)
        console.log("Socket ID:", socket.id)

        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("getUserMedia not supported - this browser/connection requires HTTPS for camera access")
          alert("Camera access requires HTTPS. The call will continue without your video.")
        }

        // Get local media - try video first, fallback to audio only, then no media
        let stream;
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
              })
              console.log("✓ Local media obtained (video + audio)")
            } catch (videoErr) {
              console.warn("Video failed, trying audio only:", videoErr.message)
              // Fallback to audio only if video fails
              stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true
              })
              console.log("✓ Local media obtained (audio only)")
            }
          } else {
            // Create a dummy stream if getUserMedia not available
            console.log("✓ No media devices available - continuing without local stream")
            stream = null
          }
        } catch (err) {
          console.warn("Failed to get any media:", err.message)
          stream = null
        }

        if (!mounted) return

        localStreamRef.current = stream
        if (localVideoRef.current && stream) {
          localVideoRef.current.srcObject = stream
        }

        // Join room
        socket.emit("join_room", roomId)
        console.log("✓ Join room emitted")
        
        // Wait for room join confirmation or timeout
        await Promise.race([
          new Promise((resolve) => {
            socket.once("room_joined", ({ roomId: joinedRoom, success }) => {
              console.log("✓ Room joined confirmation:", joinedRoom, success)
              resolve()
            })
          }),
          new Promise((resolve) => setTimeout(resolve, 2000)) // 2 second timeout
        ])

        console.log("✓ Continuing with peer setup...")

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

        // Add local tracks to peer (if stream exists)
        if (stream) {
          stream.getTracks().forEach(track => {
            peer.addTrack(track, stream)
            console.log(`✓ Added ${track.kind} track to peer`)
          })
        } else {
          console.log("⚠ No local stream - receiving only mode")
        }

        // Handle incoming tracks
        peer.ontrack = (event) => {
          console.log("✓✓✓ RECEIVED REMOTE TRACK:", event.track.kind)
          console.log("Track details:", event.track.kind, event.track.enabled, event.track.readyState)
          console.log("Stream tracks:", event.streams[0].getTracks().map(t => `${t.kind}: ${t.enabled}`))
          
          // Only set srcObject once, not on every track
          if (remoteVideoRef.current && event.streams[0] && !remoteStreamSetRef.current) {
            remoteStreamSetRef.current = true
            remoteVideoRef.current.srcObject = event.streams[0]
            console.log("✓ Remote video element srcObject set (ONCE)")
            
            // Force play after a brief delay to ensure both tracks are ready
            setTimeout(() => {
              remoteVideoRef.current.play().then(() => {
                console.log("✓ Remote video playing")
                setRemoteConnected(true)
              }).catch(err => {
                console.error("Error playing remote video:", err)
                // Try to play anyway
                setRemoteConnected(true)
              })
            }, 300)
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

        // Handle incoming offer (from student)
        socket.on("webrtc_offer", async ({ offer }) => {
          console.log("← Received OFFER from student")
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer))
            console.log("✓ Remote description set")
            
            const answer = await peer.createAnswer()
            await peer.setLocalDescription(answer)
            console.log("→ Sending ANSWER")
            socket.emit("webrtc_answer", { roomId, answer })
          } catch (err) {
            console.error("Error handling offer:", err)
          }
        })

        // Handle incoming answer (shouldn't happen for admin, but just in case)
        socket.on("webrtc_answer", async ({ answer }) => {
          console.log("← Received ANSWER (unexpected for admin)")
          try {
            await peer.setRemoteDescription(new RTCSessionDescription(answer))
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

        console.log("✓ Admin waiting for student's offer...")

      } catch (err) {
        console.error("Setup error:", err)
        alert(`Admin setup error: ${err.message}`)
      }
    }

    setupCall()

    return () => {
      mounted = false
      remoteStreamSetRef.current = false
      console.log("=== ADMIN: Cleanup ===")
      
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
    window.location.href = "/admin/dashboard/chats"
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-white font-semibold">Student</h2>
            <p className="text-sm text-gray-400">
              {remoteConnected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 relative p-4">
        {/* Remote video (student) - full screen */}
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            controls
            style={{ backgroundColor: 'black' }}
            className="w-full h-full object-cover"
          />
          {!remoteConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-3xl">ST</AvatarFallback>
                </Avatar>
                <p>Waiting for student...</p>
              </div>
            </div>
          )}
        </div>

        {/* Local video (admin) - picture in picture */}
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
