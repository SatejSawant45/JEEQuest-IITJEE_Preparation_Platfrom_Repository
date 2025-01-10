import express from 'express'; 
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';

const router = express.Router();


router.post('/register',authController.register);

router.post('/login',[
    body('email').isEmail(),
    body('password').notEmpty()
],authController.login);


export default router;