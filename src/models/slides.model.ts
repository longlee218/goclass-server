import { Schema, Types, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

interface ISlide extends SoftDeleteInterface {
	name: string;
	elements: Array<object>;
	appState: object;
	files: object;
	order: number;
	points: number;
	desc: string;
	thumbnail: string;
	assignment: Types.ObjectId;
}

export interface ISlideDocument extends ISlide, SoftDeleteDocument {}

export interface ISlideModel extends SoftDeleteModel<ISlideDocument> {}

const SlideSchema: Schema = new Schema(
	{
		name: {
			type: String,
			default: 'Slide',
		},
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

const Slide = model<ISlideDocument, ISlideModel>('slides', SlideSchema);
export default Slide;
