import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    options:[{
        type:String,
        required:true
    }],
    correctAnswer:{
        type:Number,
        retuired:true
    },
    marks:{
        type:Number,
        required:true,
        min:1
    }

});

const quizSchema = new mongoose.Schema({
    title:{
        type:String,
        retuired:true,
        time:true
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number,
        retuired:true,
        min:1
    },
    questions:[questionSchema],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},
{
    timestamps:true
});

export default mongoose.model("Quiz",quizSchema);
