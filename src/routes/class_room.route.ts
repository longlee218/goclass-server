import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import class_roomController from '../app/class_room/class_room.controller';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';

const validateRequest = schemaValidate(true);
const router = express.Router();

router.get(
	ROUTES.CLASS_ROOM,
	authJwt,
	validateRequest,
	CatchAsync(class_roomController.get.bind(class_roomController))
);

router.post(
	ROUTES.CLASS_ROOM,
	authJwt,
	validateRequest,
	CatchAsync(class_roomController.create)
);

router.put(
	ROUTES.CLASS_ROOM_PARAM,
	authJwt,
	validateRequest,
	CatchAsync(class_roomController.update)
);

export default router;
