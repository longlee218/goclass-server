import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.EXAM_NEW_ROSTER_GROUP]: Joi.object({
		name: Joi.string().required(),
		classRoom: Joi.string().required(),
		isShowResult: Joi.boolean().default(true),
		studentId: Joi.array()
			.items({
				_id: Joi.string().required(),
			})
			.default([]),
		isBlock: Joi.boolean().default(false),
		isCanHelp: Joi.boolean().default(false),
		isSuffer: Joi.boolean().default(false),
		isHide: Joi.boolean().default(true),
		isFull: Joi.boolean().required(),
	}),
	['PATCH' + ROUTES.EXAM_NEW_ROSTER_GROUP]: Joi.object({
		name: Joi.string(),
		classRoom: Joi.string(),
		isShowResult: Joi.boolean(),
		students: Joi.array().items({
			_id: Joi.string().required(),
		}),
		isBlock: Joi.boolean(),
		isCanHelp: Joi.boolean(),
		isSuffer: Joi.boolean(),
		isHide: Joi.boolean(),
		isFull: Joi.boolean(),
	}),
};
