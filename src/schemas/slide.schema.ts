import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.SLIDE]: Joi.object({
		assignmentId: Joi.string().required(),
	}),
	['POST' + ROUTES.SLIDE_CHANGE_ORDER]: Joi.object({
		order: Joi.number().required().min(1),
	}),
};
