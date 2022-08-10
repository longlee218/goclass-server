import Joi from 'joi';
import assignmentSchema from './assignment.schema';
import { default as authSchema } from './auth.schema';
import { default as classGroupSchema } from './class_group.schema';
import { default as classRoomSchema } from './class_room.schema';
import { default as studentSchema } from './student.schema';

interface SchemaOptions {
	[name: string]: Joi.ObjectSchema<any> | Joi.ArraySchema;
}
const schemas: SchemaOptions = {
	...authSchema,
	...classRoomSchema,
	...classGroupSchema,
	...studentSchema,
	...assignmentSchema,
};

export default schemas;
