import Quiz from '../models/Quiz.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';


export const createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      subject,
      description,
      duration,
      difficulty,
      tags = [],
      questions,
    } = req.body;

    // Validate required fields
    if (!title || !subject || !description || !duration || !difficulty || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing required quiz fields." });
    }

    // Validate and transform questions
    const processedQuestions = questions.map((q, index) => {
      const { question: text, type, answers, points } = q;

      if (!text || !type || !points || points < 1) {
        throw new Error(`Invalid question at index ${index + 1}`);
      }

      if (type !== "short-answer" && (!answers || answers.length < 2)) {
        throw new Error(`At least 2 options required for question ${index + 1}`);
      }

      if (type === "short-answer") {
        return {
          text,
          options: [],
          correctAnswer: 0,
          marks: points,
        };
      }

      const correctIndex = answers.findIndex((a) => a.isCorrect);
      if (correctIndex === -1) {
        throw new Error(`No correct answer selected for question ${index + 1}`);
      }

      return {
        text,
        options: answers.map((a) => a.text),
        correctAnswer: correctIndex,
        marks: points,
      };
    });

    const newQuiz = await Quiz.create({
      title,
      subject,
      description,
      duration,
      difficulty,
      tags,
      questions: processedQuestions,
      createdBy: req.user._id,
    });

    return res.status(201).json(newQuiz);
  } catch (error) {
    console.error("❌ Error creating quiz:", error.message);
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};


export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Optional: Only the creator should be allowed to update
    // if (quiz.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    const {
      title,
      subject,
      description,
      duration,
      difficulty,
      tags = [],
      questions,
    } = req.body;

    // Validate required fields
    if (!title || !subject || !description || !duration || !difficulty || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Missing or invalid quiz fields." });
    }

    // Transform questions
    const processedQuestions = questions.map((q, index) => {
      const { question: text, type, answers, points } = q;

      if (!text || !type || !points || points < 1) {
        throw new Error(`Invalid question at index ${index + 1}`);
      }

      if (type !== "short-answer" && (!answers || answers.length < 2)) {
        throw new Error(`At least 2 options required for question ${index + 1}`);
      }

      if (type === "short-answer") {
        return {
          text,
          options: [],
          correctAnswer: 0,
          marks: points,
        };
      }

      const correctIndex = answers.findIndex((a) => a.isCorrect);
      if (correctIndex === -1) {
        throw new Error(`No correct answer selected for question ${index + 1}`);
      }

      return {
        text,
        options: answers.map((a) => a.text),
        correctAnswer: correctIndex,
        marks: points,
      };
    });

    // Update the quiz
    quiz.title = title;
    quiz.subject = subject;
    quiz.description = description;
    quiz.duration = duration;
    quiz.difficulty = difficulty;
    quiz.tags = tags;
    quiz.questions = processedQuestions;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);

  } catch (error) {
    console.error("❌ Error updating quiz:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Optional: Only allow the creator to delete the quiz
    // if (quiz.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not authorized to delete this quiz" });
    // }

    await quiz.deleteOne();

    res.json({ message: "Quiz removed successfully" });
  } catch (error) {
    console.error("❌ Error deleting quiz:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAvailableQuizzes = async (req, res) => {
  try {
    console.log("📥 getAllAvailableQuizzes called");

    const { subject, difficulty, search } = req.query;

    const filter = {};

    if (subject && subject !== "All Subjects") {
      filter.subject = subject;
    }

    if (difficulty && difficulty !== "All Levels") {
      filter.difficulty = difficulty;
    }

    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive search
      filter.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .select('-questions.correctAnswer')
      .sort({ createdAt: -1 }); // most recent first

    if (quizzes.length === 0) {
      return res.status(200).json({ message: "No quizzes available at the moment", quizzes: [] });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("❌ Error in getAllAvailableQuizzes:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const getQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    console.log("Requested Quiz ID:", quizId);

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await Quiz.findById(quizId)
      .populate("createdBy", "name")
      .lean(); // converts to plain JS object early

    console.log(quiz);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.questions = quiz.questions.map(({ correctAnswer, ...q }) => q);

    // fallback if createdBy doesn't exist
    if (!quiz.createdBy) {
      quiz.createdBy = { value: "Unknown" };
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("❌ Error in getQuiz:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



