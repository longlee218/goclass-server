import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import schemaValidate from '../middlewares/schemaValidate';
import slideController from '../app/slide/slide.controller';

const validateRequest = schemaValidate(true);
const router = express.Router();

router.post(
	ROUTES.SLIDE,
	[authJwt, validateRequest],
	CatchAsync(slideController.init.bind(slideController))
);

router
	.route(ROUTES.SLIDE_PARAM)
	.get(authJwt, CatchAsync(slideController.find.bind(slideController)))
	.patch(authJwt, CatchAsync(slideController.update.bind(slideController)));

router.post(
	ROUTES.SLIDE_DUPLICATE,
	authJwt,
	CatchAsync(slideController.duplicate)
);

router.post(
	ROUTES.SLIDE_CHANGE_ORDER,
	[authJwt, validateRequest],
	CatchAsync(slideController.changeOrder)
);

export default router;
