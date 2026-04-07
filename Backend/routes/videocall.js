import express from "express";
import * as videoCallController from "../controllers/videoCallController.js";
import { adminOrMentorAuth, auth } from "../middlewares/auth.js";

const router = express.Router();

// Public routes (for messaging server)
router.post("/initiate", videoCallController.initiateCall);
router.post("/missed", videoCallController.markMissedCall);
router.put("/update-status", videoCallController.updateCallStatus);
router.put("/complete", videoCallController.completeCall);

// Admin routes
router.get("/admin/history", adminOrMentorAuth, videoCallController.getAdminCallHistory);
router.get("/admin/missed", adminOrMentorAuth, videoCallController.getMissedCalls);
router.get("/mentor/history", adminOrMentorAuth, videoCallController.getAdminCallHistory);
router.get("/mentor/missed", adminOrMentorAuth, videoCallController.getMissedCalls);

// Student routes
router.get("/student/history", auth, videoCallController.getStudentCallHistory);

export default router;
