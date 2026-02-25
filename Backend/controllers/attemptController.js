import Attempt from '../models/Attempt.js';
import Quiz from '../models/Quiz.js';

export const startAttempt = async(req,res) => {
    try
    {
        const quiz = await Quiz.findById(req.params.quizId);
        if(!quiz)
        {
            return res.status(400).json({message:"Quiz not found"});
        }

        const existingAttempt = await Attempt.findOne({
            quiz: req.params.quizId,
            user: req.user._id,
            completedAt:null
        });

        if(existingAttempt)
        {
            return res.status(400).json({message:"Active attempt already exists"});
        }

        const attempt = await Attempt.create({
            quiz: req.params.quizId,
            user: req.user._id
        });

        res.status(201).json(attempt);
    }
    catch(error)
    {
        res.status(500).json({  message :  "server error"   });
    }

}

export const submitAttempt = async(req,res) => {

    try
    {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(quizId);
        
        if(!quiz)
        {
            return res.status(404).json({message:"Quiz not found"});
        }

        // Calculate score and process answers
        let totalScore = 0;
        let earnedMarks = 0;
        let correctAnswers = 0;
        const processedAnswers = [];

        // req.body.answers is expected to be an object with questionIndex as key and selectedOption as value
        const userAnswers = req.body.answers || {};

        quiz.questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const questionMarks = question.marks || 1;
            totalScore += questionMarks;

            let isCorrect = false;
            let marksObtained = 0;

            // Convert both to numbers for comparison to handle type mismatch
            const userAnswerNum = userAnswer !== undefined ? parseInt(userAnswer) : null;
            const correctAnswerNum = parseInt(question.correctAnswer);

            console.log(`Question ${index}: User answered ${userAnswerNum} (type: ${typeof userAnswer}), Correct is ${correctAnswerNum} (type: ${typeof question.correctAnswer}), Match: ${userAnswerNum === correctAnswerNum}`);

            if (userAnswerNum !== null && !isNaN(userAnswerNum) && userAnswerNum === correctAnswerNum) {
                isCorrect = true;
                marksObtained = questionMarks;
                earnedMarks += questionMarks;
                correctAnswers++;
            }

            processedAnswers.push({
                questionId: question._id,
                selectedOption: userAnswer !== undefined ? userAnswer : -1, // -1 for unanswered
                correctAnswer: question.correctAnswer, // Include correct answer for results display
                isCorrect,
                marksObtained
            });
        });

        const percentage = totalScore > 0 ? (earnedMarks / totalScore) * 100 : 0;

        // Create new attempt record
        const attempt = await Attempt.create({
            quiz: quizId,
            user: req.user._id,
            answers: processedAnswers,
            score: earnedMarks,
            totalMarks: totalScore,
            percentage: Math.round(percentage * 10) / 10,
            correctAnswers,
            totalQuestions: quiz.questions.length,
            completedAt: new Date()
        });

        // Populate quiz details for response
        await attempt.populate('quiz', 'title duration');

        res.status(201).json({
            success: true,
            attempt: {
                _id: attempt._id,
                quiz: attempt.quiz,
                score: attempt.score,
                totalMarks: attempt.totalMarks,
                percentage: attempt.percentage,
                correctAnswers: attempt.correctAnswers,
                totalQuestions: attempt.totalQuestions,
                completedAt: attempt.completedAt,
                answers: attempt.answers
            }
        });

    }
    catch(error)
    {
        console.error('Submit attempt error:', error);
        res.status(500).json({message:"server error" });
    }

}

export const getUserAttempts = async(req,res) => {
    try{
        const attempts = await Attempt.find({user : req.user._id})
                                    .populate('quiz','title duration')
                                    .sort('-createdAt');
        res.json(attempts);
    }catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }

}

export const clearUserAttempts = async(req,res) => {
    try{
        await Attempt.deleteMany({user : req.user._id});
        res.json({message:'Quiz history cleared successfully'});
    }catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }
}



