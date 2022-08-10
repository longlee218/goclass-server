import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import assignmentController from '../app/assignment/assignment.controller';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';

const validateRequest = schemaValidate(true);
const router = express.Router();

router
	.route(ROUTES.ASSIGNMENT_CATEGORY)
	.get(
		authJwt,
		CatchAsync(
			assignmentController.getCategoriesAndAssingments.bind(
				assignmentController
			)
		)
	)
	.post(
		authJwt,
		validateRequest,
		CatchAsync(
			assignmentController.createCategories.bind(assignmentController)
		)
	);

export default router;
