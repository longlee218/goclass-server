import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface IStudentClassRoom extends SoftDeleteInterface {
	student: Types.ObjectId;
	classRoom: Types.ObjectId;
	isActive: boolean;
	studentCode: string;
	studentName: string;
}

export interface IStudentClassRoomDocument
	extends IStudentClassRoom,
		SoftDeleteDocument {}

export interface IStudentClassRoomModel
	extends SoftDeleteModel<IStudentClassRoomDocument> {}

const UserClassRoomSchema: Schema<IStudentClassRoomDocument> = new Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		classRoom: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'ClassRoom',
		},
		studentCode: String,
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
const StudentClassRoom = model<
	IStudentClassRoomDocument,
	IStudentClassRoomModel
>('student_class_rooms', UserClassRoomSchema);
export default StudentClassRoom;
