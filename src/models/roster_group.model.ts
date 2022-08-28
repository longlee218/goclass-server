import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteModel,
} from 'mongoose-delete';

import { EnumStatusRoster } from '../config/enum';

interface IRosterGroup extends SoftDeleteDocument {
	name: string;
	students: Array<Types.ObjectId>;
	roster: Types.ObjectId;
	isShowResult: boolean;
	isBlock: boolean;
	isCanHelp: boolean;
	isHide: boolean;
	isSuffer: boolean;
	status: string;
}

export interface IRosterGroupDocument
	extends IRosterGroup,
		SoftDeleteDocument {}
export interface IRosterGroupModel
	extends SoftDeleteModel<IRosterGroupDocument> {}

const RosterGroupSchema: Schema = new Schema({
	name: String,
	classRoom: {
		type: Schema.Types.ObjectId,
		ref: 'class_rooms',
	},
	students: [
		{
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	],
	roster: {
		type: Schema.Types.ObjectId,
		ref: 'rosters',
	},
	isShowResult: {
		type: Boolean,
		default: true,
	},
	isBlock: {
		type: Boolean,
		default: false,
	},
	isCanHelp: {
		type: Boolean,
		default: false,
	},
	isHide: {
		type: Boolean,
		default: false,
	},
	isSuffer: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: EnumStatusRoster,
		default: EnumStatusRoster.Online,
	},
});

RosterGroupSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const RosterGroup = model<IRosterGroup, IRosterGroupModel>(
	'roster_groups',
	RosterGroupSchema
);
export default RosterGroup;
