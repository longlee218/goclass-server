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
	.get(
		[authJwt, validId],
		CatchAsync(examController.getRosterGroup.bind(examController))
	)
	.post(
		[authJwt, validId, validateRequest],
		CatchAsync(examController.createRosterGroup.bind(examController))
	);
router
	.route(ROUTES.ROSTER_GROUP_PARAM)
	.get(
		[authJwt, validId],
		CatchAsync(examController.findRosterGroup.bind(examController))
	)
	.patch(
		[authJwt, validId, validateRequest],
		CatchAsync(examController.updateRosterGroup.bind(examController))
	)
	.delete(
		[authJwt, validId],
		CatchAsync(examController.deleteRosterGroup.bind(examController))
	);

router.get(
	ROUTES.EXAM_ANALYZE,
	[authJwt],
	CatchAsync(examController.getExamForStudent.bind(examController))
);

router.post(
	ROUTES.EXAM_JOIN,
	[authJwt],
	CatchAsync(examController.joinAssignment)
);

router.post(
	'/assignment-work/finish',
	CatchAsync(examController.finishAssignment)
);

router.post(
	'/assignment-work/reject',
	[authJwt],
	CatchAsync(examController.rejectAssignment)
);

export default router;
