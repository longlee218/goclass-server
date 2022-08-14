import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface IAssignment extends SoftDeleteInterface {
	name: string;
	subjects: string[];
	grades: string[];
	desc?: string;
	permissions: string[];
	slideCounts: Number;
	rosters: Array<Types.ObjectId>;
	parentId: Types.ObjectId;
	owner: Types.ObjectId;
	belongs: Array<Types.ObjectId>;
}

export interface IAssignmentDocument extends IAssignment, SoftDeleteDocument {}

export interface IAssignmentModel
	extends SoftDeleteModel<IAssignmentDocument> {}

const AssignmentSchema: Schema = new Schema(
	{
		name: String,
		subjects: [String],
		grades: [String],
		desc: String,
		permissions: [String],
		slideCounts: {
			type: Number,
			default: 0,
		},
		rosters: [Schema.Types.ObjectId],
		parentId: Schema.Types.ObjectId,
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
		slides: [
			{
				type: Schema.Types.ObjectId,
				ref: 'slides',
			},
		],
	},
	{
		timestamps: true,
	}
);
AssignmentSchema.set('toJSON', {
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

AssignmentSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const Assignment = model<IAssignmentDocument, IAssignmentModel>(
	'assignments',
	AssignmentSchema
);
export default Assignment;
