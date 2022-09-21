import { PaginateModel, Schema, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import { EnumGender } from '../config/enum';
import crypto from 'crypto';
import generateRandomKey from '../utils/GenerateKey';
import mongoosePaingate from 'mongoose-paginate-v2';

interface IUser extends SoftDeleteInterface {
	avatar: string;
	dob: Date;
	email: string;
	emailVerifyAt: Date;
	isEmailVerify: boolean;
	username: string;
	fullname: string;
	gender?: EnumGender;
	prefix: string;
	lastLogin: Date;
	password: string;
	salt: string;
	organization: string;
	personalKey: string;
	refreshToken: string;
	roles: string[];
	isActive: boolean;
	authType: string;
	socialId: string;
	pusherChannel: string;
	socketChannel: string;
}

export interface IUserDocument extends IUser, SoftDeleteDocument {
	setPassword: (password?: string) => void;
	comparePassword: (password: string) => boolean;
}

export interface IUserModel
	extends SoftDeleteModel<IUserDocument>,
		PaginateModel<IUserDocument> {}

const UserSchema = new Schema(
	{
		avatar: String,
		dob: Date,
		email: {
			type: String,
			required: true,
		},
		emailVerifyAt: Date,
		isEmailVerify: Boolean,
		username: String,
		fullname: String,
		gender: {
			type: String,
			enum: ['male', 'female', 'other'],
			default: 'male',
		},
		prefix: String,
		lastLogin: Date,
		password: String,
		salt: String,
		personalKey: String,
		refreshToken: String,
		organization: String,
		roles: [
			{
				type: String,
				enum: ['teacher', 'student', 'parent'],
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
		authType: String,
		socialId: String,
		pusherChannel: String,
		socketChannel: String,
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.setPassword = function (password?: string) {
	this.salt = crypto.randomBytes(16).toString('hex');
	if (!password) {
		this.password = crypto
			.pbkdf2Sync(
				new Date().getTime().toString(),
				this.salt,
				1000,
				64,
				'sha512'
			)
			.toString('hex'); // default password
	} else {
		this.password = crypto
			.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
			.toString('hex');
	}
};

UserSchema.methods.comparePassword = function (password: string): boolean {
	const _hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
		.toString('hex');
	return this.password === _hash;
};

UserSchema.pre('save', async function (next) {
	if (this.isNew) {
		this.personalKey = generateRandomKey();
		next();
	}
});

UserSchema.set('toJSON', {
	transform: (
		_,
		ret: {
			password: string;
			salt: string;
			personalKey: string;
			refreshToken: string;
			createdAt: Date;
			updatedAt: Date;
			deletedAt: Date;
			deleted: boolean;
			__v: number;
		}
	) => {
		delete ret.password;
		delete ret.salt;
		delete ret.personalKey;
		delete ret.refreshToken;
		delete ret.createdAt;
		delete ret.updatedAt;
		delete ret.deletedAt;
		delete ret.deleted;
		delete ret.__v;
		return ret;
	},
});

UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
UserSchema.plugin(mongoosePaingate);

const User = model<IUserDocument, IUserModel>('users', UserSchema);
export default User;
