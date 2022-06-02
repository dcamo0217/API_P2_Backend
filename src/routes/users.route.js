import express from 'express';

import UserController from '../controllers/User.controller.js';

const router = express.Router();

router.get('/login', UserController.login);

export default router;
