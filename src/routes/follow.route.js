import express from 'express';

import validateToken from "../middlewares/validateToken.middleware.js";
import FollowController from "../controllers/Follow.controller.js";

const router = express.Router();

router.post('/request', validateToken, FollowController.requestFollow);
router.post('/response', validateToken, FollowController.responseFollow);

export default router;