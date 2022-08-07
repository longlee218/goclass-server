import {
	Profile as GoogleProfile,
	VerifyCallback as GoogleVerifyCallback,
} from 'passport-google-oauth20';
import User, { IUserDocument } from '../../models/user.model';
import jwtService, { JWTService } from '../../services/jwt.service';

import BaseService from '../../core/base.service';
import HttpError from '../../utils/HttpError';
import { VerifiedCallback as JwtVerifiedCallback } from 'passport-jwt';
import { Request } from 'express';

export class AuthService extends BaseService {
	constructor() {
		super();
	}

	async authUserGoogle(
		req: Request,
		accessToken: string,
		refreshToken: string,
		profile: GoogleProfile,
		done: GoogleVerifyCallback
	) {
		const { _json: googleUser } = profile;
		const stateParse = JSON.parse(req.query.state as string);
		if (!googleUser.email) {
			throw new HttpError('Login fail', 400);
		}
		const user = await User.findOne({
			email: googleUser.email,
		});
		if (user) {
			req.user = user;
			return done(null, user);
		}
		try {
			const userCreated = new User({
				email: googleUser.email,
				isEmailVerify: true,
				emailVerifyAt: new Date(),
				username: null,
				firstName: googleUser.family_name,
				lastName: googleUser.given_name,
				isActive: true,
				roles: [stateParse.role],
				authType: 'google',
				socialId: googleUser.sub,
				avatar: googleUser.picture,
			});
			userCreated.setPassword();
			await userCreated.save();
			req.user = userCreated;
			return done(null, userCreated);
		} catch (error) {
			return done(error, null);
		}
	}

	async authUserJwt(req: Request, payload: any, done: JwtVerifiedCallback) {
		if (!payload) {
			return done(null, false);
		}
		if (!payload.id) {
			return done(null, false);
		}
		const user = await User.findById(payload.id);
		req.user = user;
		return done(false, user, payload);
	}

	async makeNewToken(
		refreshToken: string
	): Promise<{ accessToken: string; refreshToken: string }> {
		const payload = jwtService.decodeToken(refreshToken);
		const { id } = payload;
		const user = await User.findById(id);
		if (!user) {
			throw new HttpError('Invalid refreshtoken.', 422, 'TokenError');
		}
		return await this.makeTokenForUser(user);
	}

	async createNewUser(payload: {
		fullname: string;
		organization: string;
		email: string;
		role: string;
		password: string;
		confirm_password?: string;
	}) {
		const { fullname, organization, email, role, password } = payload;
		const user = await User.findOne({ email });
		if (user && user.isActive) {
			throw new HttpError('Tài khoản đã tồn tại trên hệ thống.', 400);
		}
		try {
			let userCreated;
			if (user && !user.isActive) {
				userCreated = await User.findOneAndUpdate(
					{
						_id: user._id,
					},
					{
						isEmailVerify: false,
						fullname: fullname,
						organization: organization,
						isActive: true,
						roles: [role],
					}
				);
			} else {
				userCreated = new User({
					email,
					isEmailVerify: false,
					fullname: fullname,
					organization: organization,
					isActive: true,
					roles: [role],
				});
			}
			userCreated.setPassword(password);
			await userCreated.save();
			return userCreated;
		} catch (error) {
			throw new HttpError(error.message, 500);
		}
	}

	async checkValidLogin(payload: { username: string; password: string }) {
		const { username, password } = payload;
		const userLogin = await User.findOne({
			$or: [{ email: username }, { username: username }],
			isActive: true,
		});
		if (!userLogin) {
			throw new HttpError('Không tìm thấy người dùng trong hệ thống.', 404);
		}
		const isValidPwd = userLogin.comparePassword(password);
		if (!isValidPwd) {
			throw new HttpError('Mật khẩu không chính xác.', 422);
		}
		return userLogin;
	}

	async makeTokenForUser(
		user: IUserDocument
	): Promise<{ accessToken: string; refreshToken: string }> {
		const payload = { id: user.id, email: user.email };
		const personalKey = user.personalKey;
		const accessToken = jwtService.signAccessToken(payload, personalKey);
		const refreshToken = jwtService.signRefreshToken(payload, personalKey);
		user.refreshToken = refreshToken;
		await user.updateOne({ refreshToken });
		return { accessToken, refreshToken };
	}
}

export default new AuthService();
