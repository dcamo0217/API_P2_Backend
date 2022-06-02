import express from 'express';

import UserController from '../controllers/User.controller.js';

const router = express.Router();

router.get('/', UserController.userInformation);
router.post('/', UserController.register);
router.post('/login', UserController.login);

export default router;
