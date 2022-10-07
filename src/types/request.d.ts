import { Types } from 'mongoose';
import { EnumGender, EnumStatusRosterGroup } from '../config/enum';
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

declare namespace Auth {
	export interface RequestLogin {
		username: string;
		password: string;
	}

	export interface RequestRegister {
		fullname: string;
		organization?: string;
		email: string;
		role: string;
		password: string;
		confirm_password?: string;
	}
}

declare namespace Exam {
	export interface RequestAddNewRosterGroup {
		classRoom: Types.ObjectId;
		name: string;
		students: Array<Types.ObjectId>;
		isShowResult: boolean;
		isBlock: boolean;
		isCanHelp: boolean;
		isHide: boolean;
		isSuffer: boolean;
		isFull: boolean;
	}

	export interface RequestUpdateRosterGroup {
		classRoom: Types.ObjectId;
		name: string;
		students: Array<Types.ObjectId>;
		isShowResult: boolean;
		isBlock: boolean;
		isCanHelp: boolean;
		isHide: boolean;
		isSuffer: boolean;
		isFull: boolean;
		status: EnumStatusRosterGroup;
	}
}
