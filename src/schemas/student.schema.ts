import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.STUDENT_OF_CLASS]: Joi.object({
		_id: Joi.string().allow(null),
		student: Joi.string().allow(null),
		fullname: Joi.string().max(50).required(),
		email: Joi.string().email().required(),
		gender: Joi.string().valid('male', 'female', 'other').allow(null),
		dob: Joi.date().allow(null),
		code: Joi.string().allow('', null),
	}),
	['PUT' + ROUTES.STUDENT_OF_CLASS_PARAM]: Joi.object({
		_id: Joi.string().required(),
		student: Joi.string().required(),
		fullname: Joi.string().max(50).required(),
		email: Joi.string().email().required(),
		gender: Joi.string().valid('male', 'female', 'other'),
		dob: Joi.date().allow(null),
		code: Joi.string().allow('', null),
	}),
	['GET' + ROUTES.STUDENT_OF_CLASS]: Joi.object({
		studentName: Joi.string(),
		studentCode: Joi.string(),
		gender: Joi.string().valid('male', 'female', 'other'),
		page: Joi.number().greater(0).allow(null).default(1),
		limit: Joi.number().greater(0).allow(null).default(10),
	}),
};
