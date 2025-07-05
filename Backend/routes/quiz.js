import express from 'express'; 
import { ExpressValidator } from "express-validator";
import { body } from 'express-validator';
import * as quizController from "../controllers/quizController.js";
import { adminAuth , auth } from "../middlewares/auth.js";

const router = express.Router();

router.post('/',adminAuth,[
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("subject").notEmpty(),
    body("duration").isNumeric(),
    body("questions.*.question").notEmpty(), // 👈 this one!
    body("questions.*.type").notEmpty(),
    body("questions.*.answers").isArray({ min: 2 }),
    body("questions.*.points").isNumeric(),
  ],quizController.createQuiz);


router.put('/:id',adminAuth,quizController.updateQuiz);
router.delete('/:id',adminAuth,quizController.deleteQuiz);

router.get('/',auth,quizController.getAllAvailableQuizzes);
router.get('/:id',auth,quizController.getQuiz);

export default router;
