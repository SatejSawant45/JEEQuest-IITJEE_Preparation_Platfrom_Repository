const express = require('express');
import * as leaderboardController from '../controllers/leaderboradController';

const router = express.Router();

router.get('/',leaderboardController.getLeaderboard);
router.get('/:quizId',leaderboardController.getQuizLeaderboard);

export default router;