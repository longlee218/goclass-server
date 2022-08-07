import { ClassRoom, StudentClassRoom, User } from '../../models';

import { EnumRole } from '../../config/enum';
import HttpError from '../../utils/HttpError';
import { Student } from '../../types/request.d';
import { Types } from 'mongoose';

export class StudentService {
	async createStudent(
		payload: Student.RequestAddStudent,
		classId: Types.ObjectId
	): Promise<void> {
		let studentId = payload.student;
		// means create anonymouse user
		if (!studentId) {
			const isExist = await User.exists({ email: payload.email });
			if (isExist) {
				throw new HttpError(
					'E-mail học sinh đã tồn tại.',
					400,
					'INVALID_INPUT'
				);
			}
			const student = await User.create({
				fullname: payload.fullname,
				roles: [EnumRole.Student],
				email: payload.email,
				isActive: false,
				isEmailVerify: false,
				dob: payload.dob,
				gender: payload.gender,
			});
			studentId = student._id;
		} else {
			const isExistStudentInClass = await StudentClassRoom.exists({
				student: studentId,
				classRoom: classId,
			});
			if (isExistStudentInClass) {
				throw new HttpError(
					'Học sinh đã tồn tại trong lớp',
					400,
					'INVALID_INPUT'
				);
			}
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
			studentName: payload.fullname,
			studentCode: payload.code || null,
			dob: payload.dob || null,
			gender: payload.gender,
			email: payload.email,
		});
		await ClassRoom.updateOne(
			{ _id: classId },
			{ $inc: { countStudents: 1 } }
		);
	}

	async updateStudent(
		payload: Student.RequestUpdateStudent,
		classId: Types.ObjectId
	): Promise<void> {
		const id = payload._id;
		await StudentClassRoom.updateOne(
			{ _id: id },
			{
				studentName: payload.fullname,
				studentCode: payload.code || null,
				dob: payload.dob || null,
				gender: payload.gender,
				email: payload.email,
			},
			{
				new: true,
			}
		);
	}

	makeQuery(payload: any) {
		console.log(payload);
		const query: any = {};
		Object.keys(payload).forEach((key) => {
			const value = payload[key];
			if (value && !key.includes('.')) {
				if (Array.isArray(value)) {
					query[key] = { $in: value };
				} else if (
					typeof value === 'string' &&
					(value === 'true' || value === 'false')
				) {
					query[key] = JSON.parse(value);
				} else if (
					typeof value === 'string' &&
					Types.ObjectId.isValid(value)
				) {
					query[key] = new Types.ObjectId(value);
				} else if (typeof value === 'string' && !isNaN(Number(value))) {
					query[key] = value;
				} else if (typeof value === 'string' && key === 'gender') {
					query[key] = value;
				} else if (typeof value === 'string') {
					query[key] = {
						$regex: new RegExp(value),
						$options: 'i',
					};
				}
			}
		});
		return query;
	}

	async getStudentOfClass(
		classRoom: string | Types.ObjectId,
		query: any,
		sortField: string,
		sortOrder: string,
		page: number = 1,
		limit: number = 10
	) {
		return await StudentClassRoom.paginate(
			this.makeQuery({
				classRoom,
				...query,
			}),
			{
				page: page,
				limit: limit,
				collation: {
					locale: 'vi',
				},
				populate: {
					path: 'student',
				},
				sort: {
					[sortField]: sortOrder === 'ascend' ? 1 : -1,
				},
			}
		);
		// const studentsOfClass = await StudentClassRoom.find({
		// 	classRoom: classId,
		// 	isActive: true,
		// });
		// const users = await User.find({
		// 	_id: { $in: studentsOfClass.map(({ _id }) => _id) },
		// });

		// const usersMapping = users.reduce(
		// 	(prev: Map<Types.ObjectId, any>, current) => {
		// 		prev.set(current._id, current.toJSON());
		// 		return prev;
		// 	},
		// 	new Map()
		// );

		// studentsOfClass.forEach((student) => {
		// 	const user = usersMapping.get(student._id);
		// 	if (user) {
		// 		user.fullname = student.studentName;
		// 		user.gender = student.gender;
		// 		user.dob = student.dob;
		// 	}
		// });
	}

	async checkHasStudent() {}
}

export default new StudentService();
