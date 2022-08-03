import { StudentClassRoom, User } from '../../models';

import { EnumRole } from '../../config/enum';
import { Student } from '../../types/request.d';
import { Types } from 'mongoose';

export class StudentService {
	async createStudent(
		payload: Student.RequestAddStudent,
		classId: Types.ObjectId
	): Promise<void> {
		let studentId = payload._id;
		if (typeof studentId === undefined) {
			const student = await User.create({
				fullname: payload.name,
				roles: [EnumRole.Student],
				email: payload.email,
				isActive: false,
				isEmailVerify: false,
				dob: payload.dob,
				gender: payload.gender,
			});
			studentId = student._id;
		} else {
			await User.findOneAndUpdate(
				{
					_id: studentId,
				},
				{
					$addToSet: { roles: EnumRole.Student },
				},
				{
					new: true,
				}
			);
		}
		await StudentClassRoom.create({
			student: studentId,
			classRoom: classId,
			studentName: payload.name,
			studentCode: payload.code || null,
		});
	}

	async initNewStudent() {}

	async checkHasStudent() {}
}

export default new StudentService();
