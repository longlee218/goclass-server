import Joi from 'joi';
import { ROUTES } from '../config/constant';

export default {
	['POST' + ROUTES.EXAM_NEW_ROSTER_GROUP]: Joi.object({
		classRoomId: Joi.string().required(),
		rosterGroupName: Joi.string().required(),
	}),
};
