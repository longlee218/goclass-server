import { Document, PaginateModel, Schema, model } from 'mongoose';

import mongoosePaingate from 'mongoose-paginate-v2';

interface ISubject extends Document {
	name: string;
	value: string;
}

export interface ISubjectDocument extends ISubject {}

export interface ISubjectModel extends PaginateModel<ISubjectDocument> {}

const OrganizationSchema: Schema = new Schema({
	name: {
		type: String,
		index: true,
	},
	value: {
		type: String,
	},
});

OrganizationSchema.plugin(mongoosePaingate);

OrganizationSchema.set('toJSON', {
	transform: (_: unknown, result: { _id: any }) => {
		delete result._id;
		return result;
	},
});

const Subject = model<ISubjectDocument, ISubjectModel>(
	'organizations',
	OrganizationSchema
);
export default Subject;
