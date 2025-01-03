const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

import authRoutes from './routes/auth.js';
import attemptRoutes from './routes/attempt.js';
import quizRoutes from './routes/quiz.js';
import leaderboardRoutes from './routes/leaderboard.js';



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api/attempt',attemptRoutes);
app.use('/api/leaderboard',leaderboardRoutes);

mongoose.connect("mongodb+srv://satejsawant90:llMHIjVUoKUzecxR@satejsawant90cluster.rpwzqu1.mongodb.net")
    .then(() => console.log('Connected to compass'))
    .catch((err) => console.error('mongodb connection error' , err));



const PORT = 5000;

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})