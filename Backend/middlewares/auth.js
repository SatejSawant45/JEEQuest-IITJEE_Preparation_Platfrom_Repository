import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Admin access required' });
            }
            next();
        })
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }

}