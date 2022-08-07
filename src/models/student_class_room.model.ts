import { PaginateModel, Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import mongoosePaingate from 'mongoose-paginate-v2';

interface IStudentClassRoom extends SoftDeleteInterface {
	student: Types.ObjectId;
	classRoom: Types.ObjectId;
	isActive: boolean;
	studentCode: string;
	dob?: Date;
	studentName: string;
	email: string;
	gender: string;
}

export interface IStudentClassRoomDocument
	extends IStudentClassRoom,
		SoftDeleteDocument {}

export interface IStudentClassRoomModel
	extends SoftDeleteModel<IStudentClassRoomDocument>,
		PaginateModel<IStudentClassRoomDocument> {}
{
}

const UserClassRoomSchema = new Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'users',
		},
		classRoom: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'ClassRoom',
		},
		studentCode: String,
		dob: Date,
		email: String,
		gender: {
			type: String,
			enum: ['male', 'female', 'other'],
			default: 'male',
		},
		studentName: String,
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

UserClassRoomSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});
UserClassRoomSchema.plugin(mongoosePaingate);

const StudentClassRoom = model<
	IStudentClassRoomDocument,
	IStudentClassRoomModel
>('student_class_rooms', UserClassRoomSchema);
export default StudentClassRoom;
