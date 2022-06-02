import express from 'express';

import UserController from '../controllers/User.controller.js';
import validateToken from "../middlewares/validateToken.middleware.js";

const router = express.Router();


router.post('/login', UserController.login);

router.post('/', UserController.register);

router.get('/', validateToken, UserController.getUserInfo);

export default router;
