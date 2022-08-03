import { Types } from 'mongoose';
import { EnumGender } from '../config/enum';
declare namespace Student {
	export interface RequestAddStudent {
		_id?: Types.ObjectId | string;
		name: string;
		email: string;
		gender?: EnumGender;
		dob?: Date;
		code?: string;
	}
}
