import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

export const auth = async (req, res, next) => {
    console.log("in middleware");
    try {
        const token = req.header('Authorization')?.replace('Bearer', '').replace(' ','');
        console.log(token)
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, "satejsawantsecret");
        console.log(decoded);
        const user = await User.findById(decoded.id);
        console.log(user);
        console.log("log3");
        if (!user) {
            throw new Error();
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Please authenticate !!' });
    }
}

export const adminAuth = async (req, res, next) => {
    console.log("in admin middleware");
    try {
        const token = req.header('Authorization')?.replace('Bearer', '').replace(' ','');
        console.log(token)
        if (!token) {
            throw new Error();
        }
        const decoded = jwt.verify(token, "satejsawantsecret");
        console.log(decoded);
        const admin = await Admin.findById(decoded.id);
        console.log(admin);
        console.log("admin loged");
        if (!admin) {
            throw new Error();
        }

        req.user = admin;
        req.admin = admin;

        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Please authenticate !!' });
    }

}

export const authOrAdmin = async (req, res, next) => {
    console.log("🔐 in authOrAdmin middleware");
    try {
        const token = req.header('Authorization')?.replace('Bearer', '').replace(' ','');
        console.log('🎫 Token received:', token ? 'Yes' : 'No')
        
        if (!token) {
            throw new Error('No token provided');
        }
        
        const decoded = jwt.verify(token, "satejsawantsecret");
        console.log('✅ Token decoded:', decoded);
        
        // Try to find user first
        let user = await User.findById(decoded.id);
        
        if (user) {
            console.log('👤 Found as User:', user.name);
            req.user = user;
            req.isAdmin = false;
            return next();
        }
        
        // If not found as user, try admin
        const admin = await Admin.findById(decoded.id);
        
        if (admin) {
            console.log('👨‍💼 Found as Admin:', admin.name);
            req.user = admin;
            req.admin = admin;
            req.isAdmin = true;
            return next();
        }
        
        // Neither user nor admin found
        throw new Error('User not found');
        
    } catch (error) {
        console.log('❌ Auth error:', error.message)
        res.status(401).json({ message: 'Please authenticate !!' });
    }
}