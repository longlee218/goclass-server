import Joi from 'joi';
import { ROUTES } from '../config/constant';
import { Types } from 'mongoose';

export default {
	['POST' + ROUTES.CLASS_ROOM]: Joi.object({
		name: Joi.string().max(100).required(),
		classRoomGroupId: Joi.string(),
		desc: Joi.string().max(300).allow(''),
		session: Joi.string().required(),
	}),
	['PUT' + ROUTES.CLASS_ROOM_PARAM]: Joi.object({
		name: Joi.string().max(100).required(),
		classRoomGroupId: Joi.string(),
		desc: Joi.string().max(300).allow(''),
		session: Joi.string().required(),
	}),
	['POST' + ROUTES.CLASS_ROOM_DULIPATE]: Joi.object({
		id: Joi.string()
			.required()
			.custom((v, helper) => {
				if (!Types.ObjectId.isValid(v)) {
					helper.error('objectId.invalid');
				}
				return v;
			})
			.messages({
				'objectId.invalid': `"id" is not valid.`,
			}),
	}),
};
