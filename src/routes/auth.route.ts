import CatchAsync from '../utils/CatchAsync';
import { ROUTES } from '../config/constant';
import authController from '../app/auth/auth.controller';
import authGoogle from '../middlewares/authGoogle';
import authJwt from '../middlewares/authJwt';
import express from 'express';
import passport from 'passport';
import schemaValidate from '../middlewares/schemaValidate';

const validateRequest = schemaValidate(true);
const router = express.Router();

router.get(
	ROUTES.AUTH_IS_LOGIN,
	authJwt,
	CatchAsync(authController.isLogined.bind(authController))
);
/**
 * Register new user
 */
router.post(
	ROUTES.AUTH_REGISTER,
	validateRequest,
	CatchAsync(authController.register.bind(authController))
);

router.post(
	ROUTES.AUTH_TOKEN,
	CatchAsync(authController.getNewToken.bind(authController))
);

router.post(
	ROUTES.AUTH_LOGIN,
	validateRequest,
	CatchAsync(authController.login.bind(authController))
);

router.post(
	ROUTES.AUTH_LOGOUT,
	authJwt,
	CatchAsync(authController.logout.bind(authController))
);
/**
 * Login by Google
 */
router.get(ROUTES.AUTH_GOOGLE, (req, res, next) =>
	passport.authenticate(
		'google',
		{
			scope: ['profile', 'email'],
			state: JSON.stringify(req.query),
		},
		() => next()
	)(req, res, next)
);

router.get(
	ROUTES.AUTH_GOOGLE_CALLBACK,
	authGoogle,
	CatchAsync(authController.authByGoogle.bind(authController))
);

export default router;
