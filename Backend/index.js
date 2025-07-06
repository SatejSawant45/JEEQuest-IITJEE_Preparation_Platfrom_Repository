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






dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','https://quiz-website-ecru-kappa.vercel.app', 'https://jeequest.satejsawant.space'], // ← use the actual port your frontend runs on
  credentials: true
}));

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


app.get('/', (req, res) => {
    res.send('Server is working!');
});


const PORT = 5000;

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})

