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
		classRoomId: Types.ObjectId;
		rosterGroupName: string;
		studentIds: Array<Types.ObjectId>;
		isShowResult: boolean;
		isBlock: boolean;
		isCanHelp: boolean;
		isSuffer: boolean;
		isHide: boolean;
	}
}
