import express from 'express'; 
import * as leaderboardController from '../controllers/leaderboradController.js';

const router = express.Router();

router.get('/',leaderboardController.getLeaderboard);
router.get('/:quizId',leaderboardController.getQuizLeaderboard);

export default router;