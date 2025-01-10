import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import userSchema from '../models/User.js';
import User from '../models/User.js';

const generateToken = (id) =>{
    
    const jwtToken = jwt.sign({id},"satejsawantsecret");
    console.log(jwtToken);
    return jwtToken; 
}



export const register = async(req,res) => {
    console.log('in register contoroller');
    console.log(req.body);
    try{
        const errors = validationResult(req);

        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()});
        }

        // const {name, email, password, role } = req.body;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        console.log(name);
        console.log(email);
        console.log(password);
        console.log(role);

        const userExists = await User.findOne({email});
        console.log(userExists);
        if(userExists)
        {
            return res.status(400).json({message:"User already exists"});
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        console.log(user);

        const token = generateToken(user._id);
        console.log(token);

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token            
        });


    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Server Error !!"});
    }

    // res.send('register controller is working !!!');
}




export const login = async(req,res)=>{
    try
    {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors:errors.array()});
        }

        const email = req.body.email;
        const password = req.body.password;
        
        const user = await User.findOne({
            email:email,
        })

        if(!user || !(await user.comparePassword(password)))
        {
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token = generateToken(user._id);

        res.status(201).json({
            id:user._id,
            namse:user.name,
            email:user.email,
            role:user.role,
            token
        });


    }   
    catch(error)
    {
        res.status(500).json({message:"Server Error"});
    } 
}