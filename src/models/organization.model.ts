import { Document, PaginateModel, Schema, model } from 'mongoose';

import mongoosePaingate from 'mongoose-paginate-v2';

interface IOrganization extends Document {
	name: string;
	edu_management: string;
	edu_department: string;
	type: string;
	level: string;
	address: string;
}

export interface IOrganizationDocument extends IOrganization {}

export interface IOrganizationModel
	extends PaginateModel<IOrganizationDocument> {}

const OrganizationSchema: Schema = new Schema({
	name: {
		type: String,
		index: true,
	},
	edu_management: String,
	edu_department: String,
	type: String,
	level: String,
	address: String,
});

OrganizationSchema.plugin(mongoosePaingate);

OrganizationSchema.set('toJSON', {
	transform: (_: unknown, result: { _id: any }) => {
		delete result._id;
		return result;
	},
});

const Organization = model<IOrganizationDocument, IOrganizationModel>(
	'organizations',
	OrganizationSchema
);
export default Organization;
