import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface IClassRoomAlert extends SoftDeleteInterface {
	name: string;
	attachments: Array<any>;
	classRoomId: Types.ObjectId;
	createdBy: Types.ObjectId;
}

export interface IClassRoomAlertDocument
	extends IClassRoomAlert,
		SoftDeleteDocument {}

export interface IClassRoomAlertModel
	extends SoftDeleteModel<IClassRoomAlertDocument> {}

const ClassRoomAlertSchema: Schema = new Schema(
	{
		content: {
			type: String,
			trim: false,
		},
		classRoomId: {
			type: Schema.Types.ObjectId,
			ref: 'class_rooms',
		},
		attachments: [Schema.Types.Mixed],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	},
	{
		timestamps: true,
	}
);

ClassRoomAlertSchema.set('toJSON', {
	transform: (
		_,
		ret: {
			deletedAt: Date;
			deleted: boolean;
			__v: number;
		}
	) => {
		delete ret.deletedAt;
		delete ret.deleted;
		delete ret.__v;
		return ret;
	},
});

ClassRoomAlertSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});
const ClassRoomAlert = model<IClassRoomAlertDocument, IClassRoomAlertModel>(
	'class_room_alerts',
	ClassRoomAlertSchema
);
export default ClassRoomAlert;
