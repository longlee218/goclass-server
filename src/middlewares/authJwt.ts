import { NextFunction, Request, Response } from 'express';

import passport from 'passport';

const authJwt = (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'jwt',
		{
			session: false,
			failWithError: true,
		},
		(error: any, user: any, info: any) => {
			if (error || !user) {
				return res.status(401).json({
					responseTime: new Date().getTime(),
					isSuccess: false,
					statusCode: 401,
					isAuto: true,
					msg: 'Unauthorized',
				});
			}
			return next();
		}
	)(req, res, next);
};
export default authJwt;
