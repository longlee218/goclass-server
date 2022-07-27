import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import userController from '../app/user/user.controller';

const router = express.Router();

router.get(ROUTES.USER_PROFILE, authJwt, CatchAsync(userController.getProfile));

export default router;
