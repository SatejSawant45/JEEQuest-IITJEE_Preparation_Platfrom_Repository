import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    
    questionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    selectedOption:{
        type:Number,
        required:true,
    }
});




const attemptSchema = new mongoose.Schema({

    quiz:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Quiz',
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    answers:[answerSchema],
    score:{
        type:Number,
        required:true,
        default:0
    },
    startedAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    completedAt:{
        type:Date
    }
},{
    timestamps:true
});



export default mongoose.model('Attempt',attemptSchema);