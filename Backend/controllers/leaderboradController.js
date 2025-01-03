import Attempt from "../models/Attempt.js";

export const getLeaderboard = async(req,res) => {
    try{
        const leaderboard = await Attempt.aggregate([
            { $match : { completedAt: { $ne:null } } },
            { $sort: { score: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as:'user'
                }
            },
            {
                $lookup:{
                    from:'quizzes',
                    localField:'quiz',
                    foreignField:'_id',
                    as:'quiz'
                }
            },
            {
                $project:{
                    'user.name':1,
                    'quiz.title':1,
                    score:1,
                    completedAt:1
                }
            }
        ]);

        res.json(leaderboard);

    }
    catch(error)
    {
        res.status(500).json({message:'Server error'});
    }
};

export const getQuizLeaderboard = async(req,res) => {
    try{
        const leaderboard = await Attempt.aggregate([
            { 
                $match:
                {
                    quiz:req.params.quizId,
                    completedAt: { $ne:null }
                }
            },
            { $sort: { score : -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as:'user'
                }
            },
            {
                $project:{
                    'user.name':1,
                    score:1,
                    completedAt:1
                }
            }


        ]);
        res.json(leaderboard);
    }catch(error){
        res.status(500).json({message:"Server error"});
    }
};
