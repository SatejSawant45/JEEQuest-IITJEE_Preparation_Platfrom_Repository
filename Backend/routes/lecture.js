import express from "express";
import { body } from "express-validator";
import * as lectureController from "../controllers/lectureController.js";
import { adminAuth, auth, authOrAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Admin routes - Create, Update, Delete lectures
router.post(
  "/",
  adminAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("youtubeUrl").notEmpty().withMessage("YouTube URL is required"),
    body("duration").notEmpty().withMessage("Duration is required"),
  ],
  lectureController.createLecture
);

router.put("/:id", adminAuth, lectureController.updateLecture);
router.delete("/:id", adminAuth, lectureController.deleteLecture);

// Public/User routes - Get lectures
router.get("/", authOrAdmin, lectureController.getAllLectures);
router.get("/subjects", authOrAdmin, lectureController.getSubjects);
router.get("/:id", authOrAdmin, lectureController.getLectureById);

export default router;
