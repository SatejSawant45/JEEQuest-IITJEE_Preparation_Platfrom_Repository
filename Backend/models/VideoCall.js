import mongoose from "mongoose";

const videoCallSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["initiated", "accepted", "rejected", "completed", "missed", "no-answer"],
      default: "initiated",
    },
    roomId: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const VideoCall = mongoose.model("VideoCall", videoCallSchema);

export default VideoCall;
