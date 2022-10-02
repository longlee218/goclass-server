import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import assignmentController from '../app/assignment/assignment.controller';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';
import validId from '../middlewares/validId';

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

router
	.route(ROUTES.ASSIGNMENT_PARAM)
	.get(
		authJwt,
		CatchAsync(assignmentController.findAssignment.bind(assignmentController))
	)
	.patch(
		[authJwt, validateRequest],
		CatchAsync(assignmentController.editAssignment.bind(assignmentController))
	)
	.delete(
		[authJwt],
		CatchAsync(
			assignmentController.deleteAssignment.bind(assignmentController)
		)
	);

router.get(
	ROUTES.ASSIGNMENTS,
	[authJwt],
	CatchAsync(
		assignmentController.getSharedAssignments.bind(assignmentController)
	)
);

router.get(
	ROUTES.ASSIGNMENT_PARAM_SHARED,
	[authJwt, validId],
	CatchAsync(
		assignmentController.findSharedAssignment.bind(assignmentController)
	)
);

router.post(
	ROUTES.ASSIGNMENT_PARAM_DUPLICATE,
	[authJwt],
	CatchAsync(
		assignmentController.duplicateAssignment.bind(assignmentController)
	)
);

router.get(
	ROUTES.ASSIGMENT_LIB,
	[authJwt],
	CatchAsync(assignmentController.getAllLibraries.bind(assignmentController))
);
router.get(
	ROUTES.ASSIGMENT_HINTS,
	CatchAsync(assignmentController.loadHints.bind(assignmentController))
);
export default router;
