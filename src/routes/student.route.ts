import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';
import studentController from '../app/student/student.controller';

const validateRequest = schemaValidate(true);
const router = express.Router();

router
	.route(ROUTES.STUDENT_OF_CLASS)
	.get(
		authJwt,
		validateRequest,
		CatchAsync(studentController.getStudentOfClass.bind(studentController))
	)
	.post(
		authJwt,
		validateRequest,
		CatchAsync(studentController.addNewStudent.bind(studentController))
	)
	.put(
		authJwt,
		validateRequest,
		CatchAsync(studentController.editStudent.bind(studentController))
	);

router.delete(
	ROUTES.STUDENT_OF_CLASS_PARAM,
	authJwt,
	CatchAsync(studentController.deleteStudent.bind(studentController))
);

export default router;
