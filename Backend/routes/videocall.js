import express from "express";
import * as videoCallController from "../controllers/videoCallController.js";
import { adminAuth, auth } from "../middlewares/auth.js";

const router = express.Router();

// Public routes (for messaging server)
router.post("/initiate", videoCallController.initiateCall);
router.post("/missed", videoCallController.markMissedCall);
router.put("/update-status", videoCallController.updateCallStatus);
router.put("/complete", videoCallController.completeCall);

// Admin routes
router.get("/admin/history", adminAuth, videoCallController.getAdminCallHistory);
router.get("/admin/missed", adminAuth, videoCallController.getMissedCalls);

// Student routes
router.get("/student/history", auth, videoCallController.getStudentCallHistory);

export default router;
