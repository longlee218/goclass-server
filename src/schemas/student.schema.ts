import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.STUDENT_OF_CLASS]: Joi.object({
		_id: Joi.string(),
		fullname: Joi.string().max(50).required(),
		email: Joi.string().email().required(),
		gender: Joi.string().valid('male', 'female', 'none').required(),
		dob: Joi.date().required(),
		code: Joi.string(),
	}),
	['PUT' + ROUTES.STUDENT_OF_CLASS_PARAM]: Joi.object({
		_id: Joi.string(),
		fullname: Joi.string().max(50).required(),
		email: Joi.string().email().required(),
		gender: Joi.string().valid('male', 'female', 'none').required(),
		dob: Joi.date().required(),
		code: Joi.string(),
	}),
};
