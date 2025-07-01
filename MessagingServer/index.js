import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// HTTP + WebSocket Server
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// Health check
app.get('/', (req, res) => {
  console.log("GET /");
  res.send('Messaging server is running...');
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Send message
  socket.on("send_message", async (data) => {
    console.log("Message received:", data);

    const { room, content, senderId, senderRole, timestamp } = data;

    try {
      // Emit to other participants in the room
      socket.to(room).emit("receive_message", {
        room,
        content,
        senderId,
        senderRole,
        timestamp
      });

      // Save message via main server API
      // Save to main server (Node + MongoDB) via fetch
      const response = await fetch("http://localhost:5000/api/messages/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ room, content, senderId, senderRole, timestamp })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to save message:", errText);
      }

    } catch (err) {
      console.error(" Error during fetch to main server:", err.message);
    }
  });

  // Test event
  socket.on("message", (arg) => {
    console.log("Ping received:", arg);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
httpServer.listen(7000, () => {
  console.log("Messaging server listening on port 7000");
});
