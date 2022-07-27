import Joi from 'joi';
import { default as authSchema } from './auth.schema';
import { default as classRoomSchema } from './class_room.schema';

interface SchemaOptions {
	[name: string]: Joi.ObjectSchema<any>;
}
const schemas: SchemaOptions = {
	...authSchema,
	...classRoomSchema,
};

export default schemas;
