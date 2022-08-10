import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.ASSIGNMENT_CATEGORY]: Joi.object({
		name: Joi.string().required(),
	}),
};
