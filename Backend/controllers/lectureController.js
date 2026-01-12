import Lecture from "../models/Lecture.js";
import { validationResult } from "express-validator";

// Create a new lecture
// Helper function to extract YouTube video ID
const extractYouTubeVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
    /(?:youtu\.be\/)([^?]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const createLecture = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, subject, youtubeUrl, duration } = req.body;
    let { thumbnail } = req.body;

    // Auto-generate thumbnail if not provided
    if (!thumbnail) {
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    const lecture = new Lecture({
      title,
      description,
      subject,
      youtubeUrl,
      thumbnail,
      duration,
      uploadedBy: req.admin._id,
    });

    await lecture.save();

    res.status(201).json({
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error creating lecture:", error);
    res.status(500).json({ message: "Server error while creating lecture" });
  }
};

// Get all lectures
export const getAllLectures = async (req, res) => {
  try {
    const { subject } = req.query;
    
    let filter = {};
    if (subject && subject !== "all") {
      filter.subject = subject;
    }

    const lectures = await Lecture.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      lectures,
      count: lectures.length,
    });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ message: "Server error while fetching lectures" });
  }
};

// Get single lecture by ID
export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.status(200).json({ lecture });
  } catch (error) {
    console.error("Error fetching lecture:", error);
    res.status(500).json({ message: "Server error while fetching lecture" });
  }
};

// Update lecture
export const updateLecture = async (req, res) => {
  try {
    const { title, description, subject, youtubeUrl, duration } = req.body;
    let { thumbnail } = req.body;

    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    // Update fields
    if (title) lecture.title = title;
    if (description) lecture.description = description;
    if (subject) lecture.subject = subject;
    if (youtubeUrl) {
      lecture.youtubeUrl = youtubeUrl;
      // Auto-generate thumbnail from new YouTube URL if thumbnail not explicitly provided
      if (!thumbnail) {
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (videoId) {
          lecture.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
    }
    if (thumbnail) lecture.thumbnail = thumbnail;
    if (duration) lecture.duration = duration;

    await lecture.save();

    res.status(200).json({
      message: "Lecture updated successfully",
      lecture,
    });
  } catch (error) {
    console.error("Error updating lecture:", error);
    res.status(500).json({ message: "Server error while updating lecture" });
  }
};

// Delete lecture
export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await Lecture.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    res.status(500).json({ message: "Server error while deleting lecture" });
  }
};

// Get unique subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Lecture.distinct("subject");
    res.status(200).json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Server error while fetching subjects" });
  }
};
