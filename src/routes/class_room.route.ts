import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import class_roomController from '../app/class_room/class_room.controller';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';
import { uploadFile } from '../middlewares/uploadFile';
import validId from '../middlewares/validId';

const validateRequest = schemaValidate(true);
const router = express.Router();

router
	.route(ROUTES.CLASS_ROOM)
	.get(
		[authJwt, validateRequest],
		CatchAsync(class_roomController.get.bind(class_roomController))
	)
	.post(
		[authJwt, validateRequest],
		CatchAsync(class_roomController.create).bind(class_roomController)
	);
router.get(
	'/class-room-query',
	[authJwt],
	CatchAsync(class_roomController.query.bind(class_roomController))
);

router.get(
	'/class-room-belong',
	[authJwt],
	CatchAsync(class_roomController.getBelong.bind(class_roomController))
);

router.post(
	'/class-room-join/:id',
	[authJwt],
	CatchAsync(class_roomController.joinClassRoom)
);

router
	.route(ROUTES.CLASS_ROOM_PARAM)
	.get(
		[authJwt, validId, validateRequest],
		CatchAsync(class_roomController.find.bind(class_roomController))
	)
	.patch([authJwt, validId], CatchAsync(class_roomController.update))
	.delete([authJwt, validId], CatchAsync(class_roomController.delete));

router.post(
	ROUTES.CLASS_ROOM_DULIPATE,
	authJwt,
	validateRequest,
	CatchAsync(class_roomController.duplicate)
);

router
	.route(ROUTES.CLASS_ROOM_ALERT)
	.post(
		[authJwt, uploadFile, validateRequest],
		CatchAsync(class_roomController.createAlert)
	)
	.get([authJwt], CatchAsync(class_roomController.getAlert));

router.post(
	ROUTES.CLASS_ROOM_NEW_SESSION,
	authJwt,
	validateRequest,
	CatchAsync(class_roomController.addNewSession)
);

router
	.route(ROUTES.CLASS_ROOM_ALERT_ID)
	.patch(
		[authJwt, uploadFile, validateRequest],
		CatchAsync(class_roomController.updateAlert)
	)
	.delete(
		[authJwt, validateRequest],
		CatchAsync(class_roomController.deleteAlert)
	);

router.delete(
	ROUTES.CLASS_ROOM_ALERT_ID_FILE,
	[authJwt],
	CatchAsync(class_roomController.deleteFileAlert)
);

export default router;
