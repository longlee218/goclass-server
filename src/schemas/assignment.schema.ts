import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.ASSIGNMENT_CATEGORY]: Joi.object({
		name: Joi.string().required(),
	}),
	['POST' + ROUTES.ASSIGNMENT_CATEGORY_ID]: Joi.object({
		name: Joi.string().required(),
	}),
	['PATCH' + ROUTES.ASSIGNMENT_PARAM]: Joi.object({
		name: Joi.string().empty(),
		desc: Joi.string().empty().allow(''),
		subjects: Joi.array().items(Joi.string()).allow(null).empty(),
		grades: Joi.array().items(Joi.string()).allow(null).empty(),
		access: Joi.string().empty(),
	}),
};
