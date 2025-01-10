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
        const attempt = await Attempt.findOne({
            quiz: req.params.id,
            user: req.user._id,
            completedAt:null
        });

        if(!attempt)
        {
            return res.status(404).json({message:"No active attempt found"});
        }

        const quiz = await Quiz.findById(req.params.id);
        if(!quiz)
        {
            return res.status(404).json({message:"Quiz not found"});
        }

            let score = 0;
            req.body.answers.forEach(answer => 
            {
                const question = quiz.questions.id(answer.questionId);
                if(question && question.correctAnswer ===  answer.selectedOption)
                {
                    score = score + question.marks;
                }

            });

            attempt.answers = req.body.answers;
            attempt.score = score;
            attempt.completedAt = new Date();
            await attempt.save();

            res.json(attempt);
        

       

    }
    catch(error)
    {
        res.status(500).json({message:"server error" });
    }

}

export const getUserAttempts = async(req,res) => {
    try{
        const attempts = await Attempt.find({user : req.user._id})
                                    .populate('quiz','title')
                                    .sort('-createdAt');
        res.json(attempts);
    }catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }

}



