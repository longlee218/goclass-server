import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import { makeUniqueId } from '../helpers/makeUniqueId';

interface IClassRoom extends SoftDeleteInterface {
	name: string;
	hashId: string;
	countStudents: number;
	session: string;
	desc: string;
	classRoomGroupId: Types.ObjectId;
	ownerId: Types.ObjectId;
	isExam: boolean;
	examClassRoomsId: Array<Types.ObjectId>;
}

export interface IClassRoomDocument extends IClassRoom, SoftDeleteDocument {}

export interface IClassRoomModel extends SoftDeleteModel<IClassRoomDocument> {}

const ClassRoomSchema: Schema = new Schema(
	{
		name: String,
		hashId: String,
		countStudents: {
			type: Number,
			min: 0,
			default: 0,
		},
		session: String,
		classRoomGroupId: {
			type: Schema.Types.ObjectId,
			ref: 'class_room_groups',
		},
		desc: String,
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
		isExam: {
			type: Boolean,
			default: false,
		},
		examClassRoomsId: [
			{
				type: Schema.Types.ObjectId,
			},
		],
	},
	{
		timestamps: true,
	}
);
ClassRoomSchema.pre('save', function (next) {
	if (this.isNew) {
		this.hashId = makeUniqueId();
		next();
	}
});

ClassRoomSchema.set('toJSON', {
	transform: (
		_,
		ret: {
			createdAt: Date;
			updatedAt: Date;
			deletedAt: Date;
			deleted: boolean;
			__v: number;
		}
	) => {
		delete ret.createdAt;
		delete ret.updatedAt;
		delete ret.deletedAt;
		delete ret.deleted;
		delete ret.__v;
		return ret;
	},
});

ClassRoomSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});
const ClassRoom = model<IClassRoomDocument, IClassRoomModel>(
	'class_rooms',
	ClassRoomSchema
);
export default ClassRoom;
