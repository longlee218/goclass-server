import { Types } from 'mongoose';
import { EnumGender } from '../config/enum';
declare namespace Student {
	export interface RequestAddStudent {
		_id?: Types.ObjectId | string;
		student?: Types.ObjectId | string;
		fullname: string;
		email: string;
		gender?: EnumGender;
		dob?: Date;
		code?: string;
	}

	export interface RequestUpdateStudent {
		_id: Types.ObjectId | string;
		student?: Types.ObjectId | string;
		fullname: string;
		email: string;
		gender?: EnumGender;
		dob?: Date;
		code?: string;
	}
}
