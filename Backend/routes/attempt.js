import express from 'express'; 
import { ExpressValidator } from 'express-validator';
import { body } from 'express-validator';
import * as attemptController from "../controllers/attemptController.js";
import { auth } from '../middlewares/auth.js';  

const router = express.Router();

router.post('/:quizId/start',auth,attemptController.startAttempt);

router.post('/:quizId/submit',auth,attemptController.submitAttempt);

router.get('/user',auth,attemptController.getUserAttempts);

router.delete('/user/clear',auth,attemptController.clearUserAttempts);

export default router;
