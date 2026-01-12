import VideoCall from "../models/VideoCall.js";

// Initiate a video call
export const initiateCall = async (req, res) => {
  try {
    const { studentId, adminId, roomId, status } = req.body;

    const videoCall = new VideoCall({
      student: studentId,
      admin: adminId,
      roomId,
      status: status || "initiated",
    });

    await videoCall.save();

    res.status(201).json({
      message: "Video call initiated",
      call: videoCall,
    });
  } catch (error) {
    console.error("Error initiating call:", error);
    res.status(500).json({ message: "Server error while initiating call" });
  }
};

// Mark call as missed
export const markMissedCall = async (req, res) => {
  try {
    const { studentId, adminId, roomId } = req.body;

    const videoCall = new VideoCall({
      student: studentId,
      admin: adminId,
      roomId,
      status: "missed",
    });

    await videoCall.save();

    res.status(201).json({
      message: "Call marked as missed",
      call: videoCall,
    });
  } catch (error) {
    console.error("Error marking missed call:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update call status
export const updateCallStatus = async (req, res) => {
  try {
    const { studentId, adminId, roomId, status, startedAt, endedAt } = req.body;

    const call = await VideoCall.findOne({
      student: studentId,
      admin: adminId,
      roomId,
    }).sort({ createdAt: -1 });

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = status;
    if (startedAt) call.startedAt = startedAt;
    if (endedAt) call.endedAt = endedAt;

    await call.save();

    res.status(200).json({
      message: "Call status updated",
      call,
    });
  } catch (error) {
    console.error("Error updating call status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete call
export const completeCall = async (req, res) => {
  try {
    const { studentId, adminId, roomId, duration, endedAt } = req.body;

    const call = await VideoCall.findOne({
      student: studentId,
      admin: adminId,
      roomId,
    }).sort({ createdAt: -1 });

    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }

    call.status = "completed";
    call.duration = duration;
    call.endedAt = endedAt || new Date();

    await call.save();

    res.status(200).json({
      message: "Call completed",
      call,
    });
  } catch (error) {
    console.error("Error completing call:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get call history for admin
export const getAdminCallHistory = async (req, res) => {
  try {
    const adminId = req.admin._id;

    const calls = await VideoCall.find({ admin: adminId })
      .populate("student", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      calls,
      count: calls.length,
    });
  } catch (error) {
    console.error("Error fetching admin call history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get missed calls for admin
export const getMissedCalls = async (req, res) => {
  try {
    const adminId = req.admin._id;

    const missedCalls = await VideoCall.find({
      admin: adminId,
      status: { $in: ["missed", "no-answer"] },
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      missedCalls,
      count: missedCalls.length,
    });
  } catch (error) {
    console.error("Error fetching missed calls:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get call history for student
export const getStudentCallHistory = async (req, res) => {
  try {
    const studentId = req.user._id;

    const calls = await VideoCall.find({ student: studentId })
      .populate("admin", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      calls,
      count: calls.length,
    });
  } catch (error) {
    console.error("Error fetching student call history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
