import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import User from '../models/User.js';
import { uploadToS3, deleteFromS3 } from '../middlewares/s3Upload.js';

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
            name:user.name,
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

// Get user profile
export const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: "Server Error" });
    }
}

// Update user profile
export const updateProfile = async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            phone,
            location,
            university,
            course,
            year,
            gpa,
            graduationYear,
            about,
            skills,
            interests,
            profilePicture,
            socialLinks
        } = req.body;

        const updateData = {};
        
        // Only update fields that are provided
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (location !== undefined) updateData.location = location;
        if (university !== undefined) updateData.university = university;
        if (course !== undefined) updateData.course = course;
        if (year !== undefined) updateData.year = year;
        if (gpa !== undefined) updateData.gpa = gpa;
        if (graduationYear !== undefined) updateData.graduationYear = graduationYear;
        if (about !== undefined) updateData.about = about;
        if (skills !== undefined) updateData.skills = skills;
        if (interests !== undefined) updateData.interests = interests;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
        if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.user.id;

        // Get user to check for existing profile picture
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete old profile picture from S3 if exists
        if (user.profilePicture) {
            try {
                // Extract S3 key from URL if it's an S3 URL
                const s3UrlPattern = /amazonaws\.com\/(.+)$/;
                const match = user.profilePicture.match(s3UrlPattern);
                if (match && match[1]) {
                    await deleteFromS3(match[1]);
                    console.log('Old profile picture deleted from S3');
                }
            } catch (deleteError) {
                console.error('Error deleting old profile picture:', deleteError);
                // Continue with upload even if delete fails
            }
        }

        // Upload new profile picture to S3
        const { url } = await uploadToS3(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'profile-pictures'
        );

        // Update user's profile picture in database with S3 URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: url },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: "Profile picture uploaded successfully",
            profilePicture: url,
            user: updatedUser
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
        res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
};