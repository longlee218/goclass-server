import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import otherController from '../app/other/other.controller';

const router = express.Router();

router.get(
	ROUTES.ORGANIZATION,
	CatchAsync(otherController.paginateOrganization)
);

router.get(ROUTES.EMAIL, authJwt, CatchAsync(otherController.paginateEmail));
router.get(ROUTES.EMAIL_EXIST, CatchAsync(otherController.isExistEmail));
router.get(ROUTES.SEARCHING, authJwt, CatchAsync(otherController.queryAllApp));
router.get('/test', authJwt, CatchAsync(otherController.test));

export default router;
