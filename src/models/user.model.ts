import { Schema, model } from 'mongoose';
import mongooseDelete, {
	SoftDeleteDocument,
	SoftDeleteInterface,
	SoftDeleteModel,
} from 'mongoose-delete';

import crypto from 'crypto';
import generateRandomKey from '../utils/GenerateKey';

interface IUser extends SoftDeleteInterface {
	avatar: string;
	dob: Date;
	email: string;
	emailVerifyAt: Date;
	isEmailVerify: boolean;
	phone: string;
	isVerifyPhone: boolean;
	username: string;
	fullname: string;
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

export interface IUserModel extends SoftDeleteModel<IUserDocument> {}

const UserSchema: Schema<IUserDocument> = new Schema(
	{
		avatar: String,
		dob: Date,
		email: String,
		emailVerifyAt: Date,
		isEmailVerify: Boolean,
		phone: String,
		isVerifyPhone: Boolean,
		username: String,
		fullname: String,
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

UserSchema.pre('save', function (next) {
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

UserSchema.plugin(mongooseDelete, { deletedAt: true });

const User = model<IUserDocument, IUserModel>('users', UserSchema);
export default User;
