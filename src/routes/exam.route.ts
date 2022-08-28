import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import examController from '../app/exam/exam.controller';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';
import validId from '../middlewares/validId';

const validateRequest = schemaValidate(true);
const router = express.Router();

router
	.route(ROUTES.EXAM_NEW_ROSTER_GROUP)
	.post(
		[authJwt, validId],
		CatchAsync(examController.createRosterGroup.bind(examController))
	);

export default router;
