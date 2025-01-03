import Quiz from '../models/Quiz';
import { validationResult } from 'express-validator';

export const createQuiz = async(req,res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()});
        }


        const quiz = await Quiz.create({
            ...req.body,
            createdby: req.user._id
        });

        res.status(201).json(quiz);

    }catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }

}

export const updateQuiz = async(req,res) => {
    try{
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz)
        {
            return res.status(404).json({message:'Quiz not found'});
        }

        // if (quiz.createdBy.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Not authorized' });
        //   }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}

        );
        res.json(updatedQuiz);
    }
    catch(error)
    {
        res.status(500).json({message:"Server error"});
    }
}

export const deleteQuiz = async(req,res) => 
{
    try{
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz)
        {
            return res.status(404).json({message:"Quiz not found"});
        }

           // if (quiz.createdBy.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Not authorized' });
        //   }

        await quiz.remove();
        res.json({message:"quiz removed"});
    }
    catch(error)
    {
        return res.status(401).json({message:"server error"});
    }

}

export const getQuizzes = async(req,res) => 
{
    try
    {
        const quizzes = await Quiz.find()
            .populate('createdBy','name')
            .select('-questions.correctAnswer');
        res.json(quizzes);
    }
    catch(error)
    {
        res.status(500).json({message: "Server error" });
    }
    
}

export const getQuiz = async(req,res) => {
    try
    {
        const quiz = await Quiz.findById(req.params.id)
                            .populate('createdBy','name')
                            .select('-questions.correctAnswer');
        if(!quiz)
        {
            return  res.status(404).json({message:"Quiz not found"});
        }

        res.json(quiz);
    }catch(error)
    {
        res.status(500).json({message:"Server error"})
    }

}