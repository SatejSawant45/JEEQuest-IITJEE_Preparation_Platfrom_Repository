import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: false,
    },
    duration: {
      type: String, // Format: "HH:MM:SS" or "MM:SS"
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
