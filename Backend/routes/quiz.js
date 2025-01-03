const express = require("express");
import { ExpressValidator } from "express-validator";
import {body} from ExpressValidator
import * as quizController from "../controllers/quizController.js";

const router = express.Router();

router.post('/',[

],quizController.createQuiz);

router.put('/:id',quizController.updateQuiz);
router.delete('/:id',quizController.deleteQuiz);

router.get('/',quizController.getQuizzes);
router.get('/:id',quizController.getQuiz)
