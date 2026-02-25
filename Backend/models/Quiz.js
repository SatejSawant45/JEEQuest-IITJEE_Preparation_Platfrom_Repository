import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    default: null,
  },
  key: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: '',
  },
}, { _id: false });

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: imageSchema,
    default: null,
  },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: imageSchema,
    default: null,
  },
  options: [optionSchema],
  correctAnswer: {
    type: Number, // index of the correct option
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    questions: [questionSchema],
    participants: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quiz", quizSchema);
