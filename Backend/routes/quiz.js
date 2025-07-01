import express from 'express'; 
import { ExpressValidator } from "express-validator";
import { body } from 'express-validator';
import * as quizController from "../controllers/quizController.js";
import { adminAuth , auth } from "../middlewares/auth.js";

const router = express.Router();

router.post('/',adminAuth,[
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('duration').isInt({ min : 1 }),
    body('question').isArray({ min : 1 })
],quizController.createQuiz);


router.put('/:id',adminAuth,quizController.updateQuiz);
router.delete('/:id',adminAuth,quizController.deleteQuiz);

router.get('/',auth,quizController.getAllAvailableQuizzes);
router.get('/:id',auth,quizController.getQuiz);

export default router;
