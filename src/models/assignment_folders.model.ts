import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface IAssignmentFolder extends SoftDeleteInterface {
	name: string;
	countAssignments: number;
	parentId: Types.ObjectId;
	isShare: boolean;
	shareTo: Array<Types.ObjectId>;
	owner: Types.ObjectId;
	belongs: Array<Types.ObjectId>;
	permissions: string[];
}

export interface IAssignmentCategoryDocument
	extends IAssignmentFolder,
		SoftDeleteDocument {}

export interface IAssignmentCategoryModel
	extends SoftDeleteModel<IAssignmentCategoryDocument> {}

const AssignmentFolderSchema: Schema = new Schema(
	{
		name: String,
		countAssignments: {
			type: Number,
			default: 0,
		},
		parentId: Schema.Types.ObjectId,
		isShare: {
			type: Boolean,
			default: false,
		},
		shareTo: [
			{
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
		],
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
		belongs: [
			{
				type: Schema.Types.ObjectId,
				ref: 'assignment_folders',
			},
		],
		permissions: [String],
	},
	{
		timestamps: true,
	}
);
AssignmentFolderSchema.set('toJSON', {
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

AssignmentFolderSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const AssignmentFolder = model<
	IAssignmentCategoryDocument,
	IAssignmentCategoryModel
>('assignment_folders', AssignmentFolderSchema);
export default AssignmentFolder;
