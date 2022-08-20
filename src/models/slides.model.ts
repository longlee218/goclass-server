import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface ISlide extends SoftDeleteInterface {
	background: string;
	content: string;
	sticker: string;
	work: string;
	order: number;
	points: number;
	assignment: Types.ObjectId;
}

export interface ISlideDocument extends ISlide, SoftDeleteDocument {}

export interface IAssignmentModel extends SoftDeleteModel<ISlideDocument> {}

const SlideSchema: Schema = new Schema(
	{
		name: {
			type: String,
			default: 'Slide',
		},
		background: {
			type: String,
			default: '',
		},
		content: {
			type: String,
			default: '',
		},
		sticker: {
			type: String,
			default: '',
		},
		work: {
			type: String,
			default: '',
		},
		order: Number,
		points: {
			type: Number,
			default: 0,
		},
		assignment: {
			type: Schema.Types.ObjectId,
			ref: 'assignments',
		},
	},
	{
		timestamps: true,
	}
);
SlideSchema.set('toJSON', {
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

SlideSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: true,
});

const Slide = model<ISlideDocument, IAssignmentModel>('slides', SlideSchema);
export default Slide;
