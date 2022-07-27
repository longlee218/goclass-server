import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PREFIX_API_V1,
} from '../config/key';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ROUTES } from '../config/constant';
import { Request } from 'express';
import User from '../models/user.model';
import authService from '../app/auth/auth.service';
import jwtService from './jwt.service';
import passport from 'passport';

const passportService = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				callbackURL: PREFIX_API_V1 + ROUTES.AUTH_GOOGLE_CALLBACK,
				passReqToCallback: true,
			},
			authService.authUserGoogle
		)
	);

	passport.use(
		new JwtStrategy(
			{
				algorithms: ['HS256'],
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				issuer: 'Education',
				ignoreExpiration: false,
				passReqToCallback: true,
				secretOrKeyProvider: (_: Request, rawJwtToken: any, done) => {
					const tokenDecode = jwtService.decodeToken(rawJwtToken);
					const userId = tokenDecode.id;
					User.findById(userId)
						.then((result) => {
							if (!result) {
								return done(true);
							}
							return done(
								false,
								jwtService.makePersonalAccessSecretKey(
									result.personalKey
								)
							);
						})
						.catch((error) => done(error));
				},
			},
			authService.authUserJwt
		)
	);
};

export default passportService;
