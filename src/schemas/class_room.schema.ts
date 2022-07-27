import Joi from 'joi';
import { ROUTES } from '../config/constant';

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
};
