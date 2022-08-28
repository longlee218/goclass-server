import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import class_groupController from '../app/class_group/class_group.controller';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';

const validateRequest = schemaValidate(true);
const router = express.Router();

router.get(ROUTES.CLASS_GROUP, authJwt, CatchAsync(class_groupController.get));

router.post(
	ROUTES.CLASS_GROUP,
	[authJwt, validateRequest],
	CatchAsync(class_groupController.create)
);

router
	.route(ROUTES.CLASS_GROUP_PARAM)
	.put([authJwt, validateRequest], CatchAsync(class_groupController.update))
	.delete([authJwt], CatchAsync(class_groupController.delete));

export default router;
