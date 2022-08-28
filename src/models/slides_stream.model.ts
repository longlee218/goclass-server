import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface ISlideStream extends SoftDeleteInterface {
	elements: Array<object>;
	appState: object;
	files: object;
	order: number;
	points: number;
	desc: string;
	thumbnail: string;
	assignment: Types.ObjectId;
}

export interface ISlideStreamDocument
	extends ISlideStream,
		SoftDeleteDocument {}

export interface ISlideStreamModel
	extends SoftDeleteModel<ISlideStreamDocument> {}

const SlideStreamSchema: Schema = new Schema(
	{
		name: String,
		desc: String,
		elements: [Schema.Types.Mixed],
		appState: Schema.Types.Mixed,
		files: Schema.Types.Mixed,
		order: Number,
		points: {
			type: Number,
			default: 0,
		},
		thumbnail: String,
		assignment: {
			type: Schema.Types.ObjectId,
			ref: 'assignment_streams',
		},
	},
	{
		timestamps: true,
	}
);
SlideStreamSchema.set('toJSON', {
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

SlideStreamSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const SlideStream = model<ISlideStreamDocument, ISlideStreamModel>(
	'slide_streams',
	SlideStreamSchema
);
export default SlideStream;
