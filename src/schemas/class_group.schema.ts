import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.CLASS_GROUP]: Joi.object({
		name: Joi.string().max(100).required(),
	}),
	['PUT' + ROUTES.CLASS_GROUP_PARAM]: Joi.object({
		name: Joi.string().max(100).required(),
	}),
};
