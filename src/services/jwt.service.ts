import { REFRESH_SECRET_KEY, SECRET_KEY } from '../config/key';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const jwtAccessOptions: SignOptions = {
	algorithm: 'HS256',
	expiresIn: '1h',
	issuer: 'Education',
	subject: 'AUTH',
};

const jwtRefreshOptions: SignOptions = {
	algorithm: 'HS256',
	expiresIn: '1d',
	issuer: 'Education',
	subject: 'AUTH',
};

export class JWTService {
	makePersonalAccessSecretKey(personalKey: string) {
		return SECRET_KEY + personalKey;
	}

	makePersonalRefreshSecretKey(personalKey: string) {
		return REFRESH_SECRET_KEY + personalKey;
	}

	signAccessToken(payload: any, personalKey: string = '') {
		return jwt.sign(
			payload,
			this.makePersonalAccessSecretKey(personalKey),
			jwtAccessOptions
		);
	}

	signRefreshToken(payload: any, personalKey: string = '') {
		return jwt.sign(
			payload,
			this.makePersonalRefreshSecretKey(personalKey),
			jwtRefreshOptions
		);
	}

	decodeToken(token: string): JwtPayload {
		return jwt.decode(token) as JwtPayload;
	}
}

export default new JWTService();
