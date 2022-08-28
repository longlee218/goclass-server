import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import { ERROR_NOT_FOUND } from '../config/error';
import HttpError from '../utils/HttpError';
import { IUserDocument } from './user.model';
import { _404 } from '../config/message_code';

interface IAssignmentStream extends SoftDeleteInterface {
	name: string;
	subjects: string[];
	grades: string[];
	desc?: string;
	assignment: Types.ObjectId;
	slideCounts: number;
	owner: Types.ObjectId;
	slides: Array<Types.ObjectId>;
}

export interface IAssignmentStreamDocument
	extends IAssignmentStream,
		SoftDeleteDocument {}

export interface IAssignmentModel
	extends SoftDeleteModel<IAssignmentStreamDocument> {}

const AssignmentStreamSchema: Schema = new Schema(
	{
		name: String,
		subjects: [String],
		grades: [String],
		desc: String,
		assignment: {
			type: Schema.Types.ObjectId,
			ref: 'assignments',
		},
		slideCounts: {
			type: Number,
			default: 0,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
		slides: [
			{
				type: Schema.Types.ObjectId,
				ref: 'slide_streams',
			},
		],
	},
	{
		timestamps: true,
	}
);

AssignmentStreamSchema.set('toJSON', {
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

AssignmentStreamSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const AssignmentStream = model<IAssignmentStreamDocument, IAssignmentModel>(
	'assignment_streams',
	AssignmentStreamSchema
);
export default AssignmentStream;
