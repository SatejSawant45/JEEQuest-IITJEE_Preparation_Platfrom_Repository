import jwt from 'jsonwebtoken';
import  User from '../models/User';

export const auth = async(req,res,next) => {
    try{
        const token = req.header('Authorization')?.replace('Bearer','');
        if(!token){
            throw new Error();
        }

        const decoded = jwt.verify(token,"satejsawantsecret");
        const user = await User.findOne(decoded.id);

        if(!user)
        {
            throw new  Error();
        }

        req.user = user;
        next();
    }catch(error){
        res.status(401).json({message:'Please authenticate'});
    }
}

export const adminAuth = async(req,res,next) => {
    try{
        await auth(req,res,()=>{
            if(req.user.role !== 'admin'){
                return res.status(403).json({message:'Admin access required'});
            }
            next();
        })
    }catch(error)
    {
        res.status(401).json({message:'Please authenticate'})
    }

}