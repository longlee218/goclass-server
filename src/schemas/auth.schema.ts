import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.AUTH_LOGIN]: Joi.object({
		username: Joi.string().required(),
		password: Joi.string().required(),
	}),
	['POST' + ROUTES.AUTH_REGISTER]: Joi.object({
		fullname: Joi.string().max(50).required(),
		role: Joi.string()
			.valid('student', 'teacher', 'parent')
			.lowercase()
			.required(),
		prefix: Joi.when('role', {
			is: 'teacher',
			then: Joi.string(),
		}),
		organization: Joi.string(),
		email: Joi.string()
			.regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)
			.required(),
		password: Joi.string().min(6).required(),
		confirmPassword: Joi.string()
			.valid(Joi.ref('password'))
			.required()
			.strict(),
	}),
	['POST' + ROUTES.AUTH_TOKEN]: Joi.object({
		refreshToken: Joi.string().required(),
	}),
};
