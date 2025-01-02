import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import userSchema from '../models/User.js';

const generateToken = (id) =>{
    const jwtToken = jwt.sign(id,"satejsawantsecret");
    return jwtTtoken; 

}


export const register = async(req,res) => {

}

export const login = async(req,res)=>{
    
}