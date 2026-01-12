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