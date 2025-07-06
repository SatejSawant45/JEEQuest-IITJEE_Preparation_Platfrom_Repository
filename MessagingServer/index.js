import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fetch from 'node-fetch'; // For Node.js < v18
import { config } from 'dotenv';
const app = express();
app.use(express.json());
app.use(cors());
config()

// HTTP + WebSocket Server
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const userToSocketMap = {}; 

// Health check
app.get('/', (req, res) => {
  console.log("GET /");
  res.send('Messaging server is running...');
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on("register", ({ userId }) => {
    userToSocketMap[userId] = socket.id;
    console.log(`🟢 Registered user ${userId} with socket ${socket.id}`);
  });

  socket.on("call_user", ({ fromUserId, toAdminId, roomId, userName }) => {
    const targetSocketId = userToSocketMap[toAdminId];
    if (targetSocketId) {
      console.log(`📲 Sending incoming_call to ${toAdminId}`);
      io.to(targetSocketId).emit("incoming_call", { fromUserId, roomId, userName });
    } else {
      console.warn(`⚠️ Admin ${toAdminId} is not registered or disconnected`);
    }
  });

  // ─── Join Chat or Call Room ───────────────────────────────
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`📌 Socket ${socket.id} joined room ${roomId}`);
  });

  // ─── Handle Text Messages ────────────────────────────────
  socket.on("send_message", async (data) => {
    const { room, content, senderId, senderRole, timestamp } = data;
    console.log("💬 Message received:", data);

    // Broadcast to other users in the room
    socket.to(room).emit("receive_message", {
      room,
      content,
      senderId,
      senderRole,
      timestamp
    });

    // Save to MongoDB via REST API
    try {
      const response = await fetch(`${process.env.MAIN_SERVER_URI}/api/messages/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, content, senderId, senderRole, timestamp })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to save message:", errText);
      }
    } catch (err) {
      console.error("⚠️ Error during message save:", err.message);
    }
  });

  // ─── WebRTC Signaling for Video Call ─────────────────────
  socket.on("webrtc_offer", ({ roomId, offer }) => {
    console.log(`📡 Offer received from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit("webrtc_offer", { offer, senderId: socket.id });
  });

  socket.on("webrtc_answer", ({ roomId, answer }) => {
    console.log(`✅ Answer received from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit("webrtc_answer", { answer, senderId: socket.id });
  });

  socket.on("ice_candidate", ({ roomId, candidate }) => {
    console.log(`❄️ ICE candidate from ${socket.id} in room ${roomId}`);
    socket.to(roomId).emit("ice_candidate", { candidate, senderId: socket.id });
  });

  // ─── Disconnect ───────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log("⛔ User disconnected:", socket.id);
  });
});

// ─── Start Server ─────────────────────────────────────────────
httpServer.listen(7000, () => {
  console.log("🚀 Messaging server with WebRTC signaling running on port 7000");
});
