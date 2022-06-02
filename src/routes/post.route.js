import express from 'express';

import validateToken from "../middlewares/validateToken.middleware.js";
import PostController from '../controllers/Post.controller.js';
import ActivityRegisterController from '../controllers/ActivityRegister.controller.js';

const router = express.Router();

router.post('/', validateToken, PostController.createPost);
router.get('/', PostController.getPost);
router.post('/like', validateToken, ActivityRegisterController.createLike);
router.post('/save', validateToken, ActivityRegisterController.createSave);
router.post('/comment', validateToken, ActivityRegisterController.createComment);

export default router;
