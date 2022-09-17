import { Document, PaginateModel, Schema, Types, model } from 'mongoose';

import mongoosePaingate from 'mongoose-paginate-v2';

interface ISubject extends Document {
	elements: Array<object>;
	user: Types.ObjectId;
}

export interface ILibraryDocument extends ISubject {}

export interface ILibraryModel extends PaginateModel<ILibraryDocument> {}

const LibrarySchema: Schema = new Schema({
	elements: [Schema.Types.Mixed],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
});

LibrarySchema.plugin(mongoosePaingate);

LibrarySchema.set('toJSON', {
	transform: (_: unknown, result: { _id: any }) => {
		delete result._id;
		return result;
	},
});

const Library = model<ILibraryDocument, ILibraryModel>(
	'libraries',
	LibrarySchema
);
export default Library;
