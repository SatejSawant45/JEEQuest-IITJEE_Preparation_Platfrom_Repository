import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    // Profile Information
    phone:{
        type:String,
        trim:true
    },
    location:{
        type:String,
        trim:true
    },
    university:{
        type:String,
        trim:true
    },
    course:{
        type:String,
        trim:true
    },
    year:{
        type:String,
        trim:true
    },
    gpa:{
        type:String,
        trim:true
    },
    graduationYear:{
        type:String,
        trim:true
    },
    about:{
        type:String,
        trim:true,
        maxlength:500
    },
    skills:{
        type:[String],
        default:[]
    },
    interests:{
        type:[String],
        default:[]
    },
    profilePicture:{
        type:String, // URL to profile picture
        trim:true
    },
    socialLinks:{
        linkedin:{
            type:String,
            trim:true
        },
        github:{
            type:String,
            trim:true
        },
        portfolio:{
            type:String,
            trim:true
        }
    }

},{
    timestamps:true
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword)
{
    return bcrypt.compare(candidatePassword,this.password);
}



export default mongoose.model('User',userSchema);