import MongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';
import { Schema, Types, model } from 'mongoose';

interface IClassGroup extends SoftDeleteInterface {
	name: string;
	ownerId: Types.ObjectId;
}

export interface IClassGroupDocument extends IClassGroup, SoftDeleteDocument {}

export interface IClassGroupModel
	extends SoftDeleteModel<IClassGroupDocument> {}

const ClassGroupSchema: Schema = new Schema(
	{
		name: String,
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	},
	{
		timestamps: true,
	}
);

ClassGroupSchema.set('toJSON', {
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

ClassGroupSchema.plugin(MongooseDelete, { deletedAt: true });
const ClassGroup = model<IClassGroupDocument, IClassGroupModel>(
	'class_groups',
	ClassGroupSchema
);
export default ClassGroup;
