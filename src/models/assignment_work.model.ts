import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import { _404 } from '../config/message_code';

interface IAssignmentWork extends SoftDeleteInterface {
	encryptKey: string;
	assignmentId: Types.ObjectId;
	rosterGroupId: Types.ObjectId;
	slideIds: Array<Types.ObjectId>;
	isFinish: boolean;
	isReject: boolean;
	point: number;
	workBy: Types.ObjectId;
	verifyBy: Types.ObjectId;
}

export interface IAssignmentWorkDocument
	extends IAssignmentWork,
		SoftDeleteDocument {}

export interface IAssignmentWorkModel
	extends SoftDeleteModel<IAssignmentWorkDocument> {}

const AssignmentWorkSchema: Schema = new Schema(
	{
		encryptKey: String,
		assignmentId: {
			type: Schema.Types.ObjectId,
			ref: 'assignments',
		},
		rosterGroupId: {
			type: Schema.Types.ObjectId,
			ref: 'roster_groups',
		},
		slideIds: [
			{
				type: Schema.Types.ObjectId,
				ref: 'slides',
			},
		],
		isFinish: { type: Boolean, default: false },
		isReject: { type: Boolean, default: false },
		workBy: { type: Schema.Types.ObjectId, ref: 'users' },
		verifyBy: { type: Schema.Types.ObjectId, ref: 'users' },
	},
	{
		timestamps: true,
	}
);

AssignmentWorkSchema.set('toJSON', {
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

AssignmentWorkSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const AssignmentWork = model<IAssignmentWorkDocument, IAssignmentWorkModel>(
	'assignment_works',
	AssignmentWorkSchema
);
export default AssignmentWork;
