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

interface IAssignment extends SoftDeleteInterface {
	name: string;
	subjects: string[];
	grades: string[];
	access: string;
	desc?: string;
	permissions: string[];
	slideCounts: number;
	rosters: Types.ObjectId;
	parentId: Types.ObjectId;
	owner: Types.ObjectId;
	belongs: Array<Types.ObjectId>;
	slides: Array<Types.ObjectId>;
}

export interface IAssignmentDocument extends IAssignment, SoftDeleteDocument {
	onAddNewSlide: (slideId: Types.ObjectId) => Promise<IAssignmentDocument>;
}

export interface IAssignmentModel extends SoftDeleteModel<IAssignmentDocument> {
	findByIdOrFail(
		id: string | Types.ObjectId,
		user?: IUserDocument
	): Promise<IAssignmentDocument>;
}

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
		rosters: {
			type: Schema.Types.ObjectId,
			ref: 'rosters',
		},
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

AssignmentSchema.statics.findByIdOrFail = function (
	id: string | Types.ObjectId,
	user: IUserDocument
) {
	if (user) {
		return this.findOne({ _id: id, owner: user._id }).orFail(
			() => new HttpError(_404, 404, ERROR_NOT_FOUND)
		);
	}
	return this.findById(id).orFail(
		() => new HttpError(_404, 404, ERROR_NOT_FOUND)
	);
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
