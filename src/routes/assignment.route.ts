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
		CatchAsync(assignmentController.createFolder.bind(assignmentController))
	);

router.put(
	ROUTES.ASSIGNMENT_CATEGORY_ID,
	authJwt,
	validateRequest,
	CatchAsync(assignmentController.editFolder.bind(assignmentController))
);

router.delete(
	ROUTES.ASSIGNMENT_CATEGORY_ID,
	authJwt,
	CatchAsync(assignmentController.deleteFolder.bind(assignmentController))
);

router.get(
	ROUTES.ASSIGNMENT_BREADCRUMB,
	authJwt,
	CatchAsync(assignmentController.getBreadcrumbs.bind(assignmentController))
);

router.post(
	ROUTES.ASSIGNMENT_INIT_BLANK,
	authJwt,
	CatchAsync(assignmentController.initAssignment.bind(assignmentController))
);

router.get(
	ROUTES.ASSIGNMENT_PARAM,
	authJwt,
	CatchAsync(assignmentController.findAssign.bind(assignmentController))
);

export default router;
