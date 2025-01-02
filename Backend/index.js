const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://satejsawant90:llMHIjVUoKUzecxR@satejsawant90cluster.rpwzqu1.mongodb.net")
    .then(() => console.log('Connected to compass'))
    .catch((err) => console.error('mongodb connection error' , err));


const PORT = 5000;

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})