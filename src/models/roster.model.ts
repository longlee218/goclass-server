import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteModel,
} from 'mongoose-delete';

import { ERROR_NOT_FOUND } from '../config/error';
import { EnumStatusRoster } from '../config/enum';
import HttpError from '../utils/HttpError';
import { _404 } from '../config/message_code';

interface IRoster extends SoftDeleteDocument {
	status: string;
	assignment: Types.ObjectId;
	assignmentStream: Types.ObjectId;
	assignmentPublics: Array<Types.ObjectId>;
	startAt: Date;
	endAt: Date;
}

export interface IRosterDocument extends IRoster, SoftDeleteDocument {}
export interface IRosterModel extends SoftDeleteModel<IRosterDocument> {
	findByIdOrFail(id: string | Types.ObjectId): Promise<IRosterDocument>;
}

const RosterSchema: Schema = new Schema(
	{
		status: {
			type: String,
			enum: EnumStatusRoster,
			default: EnumStatusRoster.Offline,
		},
		assignment: {
			type: Schema.Types.ObjectId,
			ref: 'assignments',
			required: true,
		},
		assignmentStream: {
			type: Schema.Types.ObjectId,
			ref: 'assignment_streams',
		},
		assignmentPublics: [
			{
				type: Schema.Types.ObjectId,
				ref: 'assignment_streams',
			},
		],
		startAt: Date,
		endAt: Date,
	},
	{ timestamps: true }
);

RosterSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

RosterSchema.statics.findByIdOrFail = function (id: string | Types.ObjectId) {
	return this.findById(id).orFail(
		() => new HttpError(_404, 404, ERROR_NOT_FOUND)
	);
};

const Roster = model<IRoster, IRosterModel>('rosters', RosterSchema);
export default Roster;
