const express = require('express');
import { body } from 'express-validator';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/register',[
    body('name').trim(),notEmpty(),
    body('email').isEmail(),
    body('password').isLength({mid:6}),
    body('role').isIn(['user','admin'])
],authController.register);

router.post('/login',[
    body('email').isEmail(),
    body('password').notEmpty()
],authController.login);


export default router;