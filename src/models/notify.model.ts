import { Document, PaginateModel, Schema, Types, model } from 'mongoose';

import mongoosePaingate from 'mongoose-paginate-v2';

interface INotify extends Document {
	content: string;
	image: string;
	type: string;
	linkTo: string;
	readtAt: Date;
	recievers: Array<Types.ObjectId>;
}

export interface INotifyDocument extends INotify {}

export interface INotifyModel extends PaginateModel<INotifyDocument> {}

const NotifySchema: Schema = new Schema(
	{
		content: String,
		image: String,
		type: String,
		linkTo: String,
		readtAt: Date,
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
		recievers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'users',
			},
		],
	},
	{ timestamps: true }
);

NotifySchema.plugin(mongoosePaingate);

NotifySchema.set('toJSON', {
	transform: (_: unknown, result: { _id: any }) => {
		delete result._id;
		return result;
	},
});

const Notify = model<INotifyDocument, INotifyModel>('notifies', NotifySchema);
export default Notify;
