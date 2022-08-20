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
	access: string;
	desc?: string;
	permissions: string[];
	slideCounts: number;
	rosters: Array<Types.ObjectId>;
	parentId: Types.ObjectId;
	owner: Types.ObjectId;
	belongs: Array<Types.ObjectId>;
}

export interface IAssignmentDocument extends IAssignment, SoftDeleteDocument {
	onAddNewSlide: (slideId: Types.ObjectId) => Promise<IAssignmentDocument>;
}

export interface IAssignmentModel
	extends SoftDeleteModel<IAssignmentDocument> {}

const AssignmentSchema: Schema = new Schema(
	{
		name: String,
		subjects: [String],
		grades: [String],
		desc: String,
		permissions: [String],
		access: {
			type: String,
			default: 'private',
		},
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

AssignmentSchema.methods.onAddNewSlide = function (slideId: Types.ObjectId) {
	this.slideCounts = this.slideCounts + 1;
	this.slides = [...this.slides, slideId];
	return this.save();
};

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
