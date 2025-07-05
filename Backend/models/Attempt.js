import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz.questions", // optional: for better population or reference clarity
    required: true,
  },
  selectedOption: {
    type: Number, // index of the selected option (0-based)
    required: true,
  },
  isCorrect: {
    type: Boolean, // optional: store correctness for quick access
    default: null,
  },
  marksObtained: {
    type: Number, // optional: useful for partial scoring / analytics
    default: 0,
  },
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