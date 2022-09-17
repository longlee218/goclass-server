import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import notifyController from '../app/notify/notify.controller';

const router = express.Router();
router.get(ROUTES.NOTIFY, authJwt, CatchAsync(notifyController.getAllNotify));

export default router;
