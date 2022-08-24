import { CookieOptions, NextFunction, Request, Response } from 'express';

import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import { IUserDocument } from '../../models/user.model';
import authService from './auth.service';

const cookieOptions: CookieOptions = {
	maxAge: 1000 * 60 * 60 * 2, // would expire after 2 hour
	httpOnly: true, // The cookie only accessible by the web server
	signed: true, // Indicates if the cookie should be signed
	sameSite: true,
};

export class AuthController extends BaseController {
	constructor() {
		super();
	}

	async isLogined(req: Request, res: Response, next: NextFunction) {
		return new HttpResponse({
			res,
			msg: 'oke',
			statusCode: 200,
			data: { user: req.user },
		});
	}

	_saveTokenIntoCookie(
		res: Response,
		tokens: { accessToken: string; refreshToken: string }
	) {
		res.cookie('_token', tokens.accessToken, cookieOptions);
		res.cookie('_rtoken', tokens.refreshToken, {
			...cookieOptions,
			maxAge: 1000 * 60 * 60 * 24 * 30, // after 30 days
		});
	}

	async authByGoogle(req: Request, res: Response, next: NextFunction) {
		const { user } = req;
		const tokens = await authService.makeTokenForUser(user as IUserDocument);
		await user.updateOne({ lastLogin: new Date() }, { new: true });
		this._saveTokenIntoCookie(res, tokens);
		res.send(tokens);
		// res.end('Redirect to ' + CLIENT_HOST);
		// res.redirect(CLIENT_HOST);
	}

	/**
	 *  Get new access token and refresh token after expire access token
	 */
	async getNewToken(req: Request, res: Response, next: NextFunction) {
		const refreshToken = req.signedCookies['_rtoken'] as string;
		if (!refreshToken) {
			return new HttpResponse({
				res,
				statusCode: 401,
				msg: 'Unauthorized.',
			});
		}
		const tokens = await authService.makeNewToken(refreshToken);
		this._saveTokenIntoCookie(res, tokens);
		return new HttpResponse({ res });
	}

	async register(req: Request, res: Response, next: NextFunction) {
		const { body } = req;
		const userCreated = await authService.createNewUser(body);
		const tokens = await authService.makeTokenForUser(userCreated);
		this._saveTokenIntoCookie(res, tokens);
		await userCreated.updateOne({ lastLogin: new Date() }, { new: true });
		return new HttpResponse({
			res,
			msg: 'ok',
			statusCode: 201,
			data: { user: userCreated, tokens },
		});
	}

	async login(req: Request, res: Response, next: NextFunction) {
		const { body } = req;
		console.log({ body });
		const user = await authService.checkValidLogin(body);
		const tokens = await authService.makeTokenForUser(user);
		this._saveTokenIntoCookie(res, tokens);
		await user.updateOne({ lastLogin: new Date() }, { new: true });
		return new HttpResponse({ res, msg: 'ok', data: { user, tokens } });
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		const user = req.user;
		await user.updateOne({ refreshToken: null });
		res.clearCookie('_token');
		res.clearCookie('_rtoken');
		return res.json(201);
	}
}

export default new AuthController();
