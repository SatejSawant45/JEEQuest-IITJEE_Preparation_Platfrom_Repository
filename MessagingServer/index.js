import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from 'dotenv';
const app = express();
app.use(express.json());
app.use(cors());
config()

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const userToSocketMap = {}; 
const onlineAdmins = new Set(); // Track online admins
const onlineMentors = new Set();

app.get('/', (req, res) => {
  console.log("GET /");
  res.send('Messaging server is running...');
});

app.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedSockets: io.sockets.sockets.size,
    onlineAdmins: Array.from(onlineAdmins),
    onlineMentors: Array.from(onlineMentors)
  });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on("register", ({ userId, userRole }) => {
    userToSocketMap[userId] = socket.id;
    console.log(`Registered ${userRole} ${userId} with socket ${socket.id}`);
    
    // Track admin/mentor online status
    if (userRole === 'admin') {
      onlineAdmins.add(userId);
      console.log(`Admin ${userId} is now online`);
      // Broadcast admin online status
      io.emit("admin_status_changed", { adminId: userId, isOnline: true });
    } else if (userRole === 'mentor') {
      onlineMentors.add(userId);
      console.log(`Mentor ${userId} is now online`);
      io.emit("mentor_status_changed", { mentorId: userId, isOnline: true });
    }
  });

  // New event: Initiate video call
  socket.on("initiate_call", async ({ studentId, adminId, adminModel, roomId, studentName }) => {
    const adminSocketId = userToSocketMap[adminId];
    const resolvedModel = adminModel || 'Admin';
    const isStaffOnline =
      resolvedModel === 'Mentor' ? onlineMentors.has(adminId) : onlineAdmins.has(adminId);
    
    console.log(`Call initiated: Student ${studentId} calling Admin ${adminId}`);
    console.log(`Staff ${adminId} (${resolvedModel}) online:`, isStaffOnline);
    console.log(`Admin socket ID:`, adminSocketId);
    
    if (adminSocketId && isStaffOnline) {
      // Admin is online - send incoming call notification
      console.log(`Sending incoming_call to admin socket ${adminSocketId}`);
      io.to(adminSocketId).emit("incoming_call", {
        studentId,
        studentName,
        roomId,
        callTime: new Date().toISOString()
      });
      
      // Save call as initiated in database
      try {
        await fetch(`${process.env.MAIN_SERVER_URI}/api/videocalls/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            adminId,
            adminModel: resolvedModel,
            roomId,
            status: "initiated"
          })
        });
      } catch (err) {
        console.error("Error saving call initiation:", err.message);
      }
    } else {
      // Admin is offline - mark as missed
      console.log(`Admin ${adminId} is offline - marking call as missed`);
      const studentSocketId = userToSocketMap[studentId];
      if (studentSocketId) {
        io.to(studentSocketId).emit("call_failed", {
          message: "Admin is currently offline",
          adminId
        });
      }
      
      // Save as missed call
      try {
        await fetch(`${process.env.MAIN_SERVER_URI}/api/videocalls/missed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            adminId,
            adminModel: resolvedModel,
            roomId,
            status: "missed"
          })
        });
      } catch (err) {
        console.error("Error saving missed call:", err.message);
      }
    }
  });

  // New event: Accept call
  socket.on("accept_call", async ({ studentId, adminId, adminModel, roomId }) => {
    const studentSocketId = userToSocketMap[studentId];
    console.log(`Admin ${adminId} accepted call from student ${studentId}`);
    
    if (studentSocketId) {
      io.to(studentSocketId).emit("call_accepted", { adminId, roomId });
      
      // Update call status to accepted
      try {
        await fetch(`${process.env.MAIN_SERVER_URI}/api/videocalls/update-status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            adminId,
            adminModel: adminModel || 'Admin',
            roomId,
            status: "accepted",
            startedAt: new Date()
          })
        });
      } catch (err) {
        console.error("Error updating call status:", err.message);
      }
    }
  });

  // New event: Reject call
  socket.on("reject_call", async ({ studentId, adminId, adminModel, roomId }) => {
    const studentSocketId = userToSocketMap[studentId];
    console.log(`Admin ${adminId} rejected call from student ${studentId}`);
    
    if (studentSocketId) {
      io.to(studentSocketId).emit("call_rejected", { adminId });
      
      // Update call status to rejected
      try {
        await fetch(`${process.env.MAIN_SERVER_URI}/api/videocalls/update-status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            adminId,
            adminModel: adminModel || 'Admin',
            roomId,
            status: "rejected"
          })
        });
      } catch (err) {
        console.error("Error updating call status:", err.message);
      }
    }
  });

  // New event: End call
  socket.on("end_call", async ({ studentId, adminId, adminModel, roomId, duration }) => {
    console.log(`Call ended: Student ${studentId} - Admin ${adminId}, Duration: ${duration}s`);
    
    // Notify other party
    const studentSocketId = userToSocketMap[studentId];
    const adminSocketId = userToSocketMap[adminId];
    
    if (studentSocketId) {
      io.to(studentSocketId).emit("call_ended", { roomId });
    }
    if (adminSocketId) {
      io.to(adminSocketId).emit("call_ended", { roomId });
    }
    
    // Update call status to completed
    try {
      await fetch(`${process.env.MAIN_SERVER_URI}/api/videocalls/complete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          adminId,
          adminModel: adminModel || 'Admin',
          roomId,
          status: "completed",
          duration,
          endedAt: new Date()
        })
      });
    } catch (err) {
      console.error("Error completing call:", err.message);
    }
  });

  socket.on("call_user", ({ fromUserId, toAdminId, roomId, userName }) => {
    const targetSocketId = userToSocketMap[toAdminId];
    if (targetSocketId) {
      console.log(`Sending incoming_call to ${toAdminId}`);
      io.to(targetSocketId).emit("incoming_call", { fromUserId, roomId, userName });
    } else {
      console.warn(`Admin ${toAdminId} is not registered or disconnected`);
    }
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    // Get room members for debugging
    const room = io.sockets.adapter.rooms.get(roomId);
    console.log(`Room ${roomId} now has ${room ? room.size : 0} members`);
    // Send confirmation back to client
    socket.emit("room_joined", { roomId, success: true });
  });

  socket.on("send_message", async (data) => {
    const { room, content, senderId, senderRole, timestamp } = data;
    console.log("Message received:", data);

    socket.to(room).emit("receive_message", {
      room,
      content,
      senderId,
      senderRole,
      timestamp
    });

    try {
      const response = await fetch(`${process.env.MAIN_SERVER_URI}/api/messages/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, content, senderId, senderRole, timestamp })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to save message:", errText);
      }
    } catch (err) {
      console.error("Error during message save:", err.message);
    }
  });

  socket.on("webrtc_offer", ({ roomId, offer }) => {
    console.log(`Offer received from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit("webrtc_offer", { offer, senderId: socket.id });
  });

  socket.on("webrtc_answer", ({ roomId, answer }) => {
    console.log(`Answer received from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit("webrtc_answer", { answer, senderId: socket.id });
  });

  socket.on("ice_candidate", ({ roomId, candidate }) => {
    console.log(`ICE candidate from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("ice_candidate", { candidate, senderId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
    
    // Remove from userToSocketMap and mark admin as offline
    for (const [userId, socketId] of Object.entries(userToSocketMap)) {
      if (socketId === socket.id) {
        delete userToSocketMap[userId];
        
        // If it was an admin, mark as offline
        if (onlineAdmins.has(userId)) {
          onlineAdmins.delete(userId);
          console.log(`Admin ${userId} is now offline`);
          io.emit("admin_status_changed", { adminId: userId, isOnline: false });
        } else if (onlineMentors.has(userId)) {
          onlineMentors.delete(userId);
          console.log(`Mentor ${userId} is now offline`);
          io.emit("mentor_status_changed", { mentorId: userId, isOnline: false });
        }
        break;
      }
    }
  });
});

httpServer.listen(7000, '0.0.0.0', () => {
  console.log("Messaging server with WebRTC signaling running on port 7000");
  console.log("Network: http://10.62.214.126:7000");
});
