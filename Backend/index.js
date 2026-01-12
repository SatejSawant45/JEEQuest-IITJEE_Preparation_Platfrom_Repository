import express from 'express'; 
import cors from 'cors';
import  dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import attemptRoutes from './routes/attempt.js';
import quizRoutes from './routes/quiz.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/message.js';
import blogRoutes from './routes/blog.js';
import lectureRoutes from './routes/lecture.js';
import videoCallRoutes from './routes/videocall.js';






dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://10.62.214.126:5173', 'https://quiz-website-ecru-kappa.vercel.app', 'https://jeequest.satejsawant.space'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to compass'))
    .catch((err) => console.error('mongodb connection error' , err));

app.use((err, req, res, next) => {
    console.error(err.stack);  
    res.status(500).json({ message: 'Something went wrong!' });
});



app.use('/api/auth',authRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/attempt',attemptRoutes);
app.use('/api/leaderboard',leaderboardRoutes);
app.use('/api/blog',blogRoutes);
app.use('/api/lectures',lectureRoutes);
app.use('/api/videocalls',videoCallRoutes);


app.get('/', (req, res) => {
    res.send('Server is working!');
});


const PORT = 5000;

app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`Network: http://10.62.214.126:${PORT}`);
})

