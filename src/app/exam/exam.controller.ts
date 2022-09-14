import { ClassRoom, StudentClassRoom } from '../../models';
import { EnumStatusRoster, EnumStatusRosterGroup } from '../../config/enum';
import { NextFunction, Request, Response } from 'express';
import {
	STUDENT_ARE_IN_OTHER_GROUP,
	_200,
	_400,
	_404,
} from '../../config/message_code';

import AssignmentStream from '../../models/assignment_stream.model';
import BaseController from '../../core/base.controller';
import { Exam } from '../../types/request';
import HttpError from '../../utils/HttpError';
import HttpResponse from '../../utils/HttpResponse';
import Roster from '../../models/roster.model';
import RosterGroup from '../../models/roster_group.model';
import SlideStream from '../../models/slides_stream.model';
import { Types } from 'mongoose';
import assignmentService from '../assignment/assignment.service';
import examService from './exam.service';

class ExamController extends BaseController {
	async getRosterGroup(req: Request, res: Response, next: NextFunction) {
		const rosterId = new Types.ObjectId(req.params.id);
		const rosterGroups = await RosterGroup.find({ roster: rosterId }).sort(
			'-createdAt'
		);
		const mapping = new Map();
		const today = new Date().toLocaleDateString();
		rosterGroups.forEach((rosterGroup) => {
			const createdAt = new Date(rosterGroup.createdAt).toLocaleDateString();
			const key = today === createdAt ? 'Hôm nay' : createdAt;
			if (!mapping.has(key)) {
				mapping.set(key, []);
			}
			mapping.get(key).push(rosterGroup.toJSON());
		});
		const results = [];
		for (const [key, value] of mapping) {
			results.push({
				date: key,
				items: value,
			});
		}
		return new HttpResponse({
			res,
			data: results,
			statusCode: 201,
		});
	}

	async createRosterGroup(req: Request, res: Response, next: NextFunction) {
		const user = req.user;
		const rosterId = new Types.ObjectId(req.params.id);
		const roster = await Roster.findByIdOrFail(rosterId);
		const {
			classRoom,
			name,
			isShowResult,
			students,
			isBlock,
			isCanHelp,
			isSuffer,
			isHide,
			isFull,
		} = req.body as Exam.RequestAddNewRosterGroup;

		// Enter payload for roster group
		const rosterGroup = new RosterGroup();
		rosterGroup.roster = roster._id;
		rosterGroup.status = EnumStatusRosterGroup.Ready;
		rosterGroup.owner = user._id;
		rosterGroup.classRoom = classRoom;
		rosterGroup.isShowResult = isShowResult;
		rosterGroup.isBlock = isBlock ?? false;
		rosterGroup.isCanHelp = isCanHelp ?? false;
		rosterGroup.isHide = isHide ?? true;
		rosterGroup.isSuffer = isSuffer ?? false;
		rosterGroup.isFull = isFull ?? false;

		// If roster is Offline then make it Online
		if (roster.status === EnumStatusRoster.Offline) {
			roster.status = EnumStatusRoster.Online;
			// Make assign_stream and slide_stream depended on assignId
			// const { assignmentData, listSlideData } =
			// 	await assignmentService.makeCopyAssignmentData(
			// 		roster.assignment,
			// 		req.user,
			// 		''
			// 	);
			// const assignStream = await AssignmentStream.create(assignmentData);
			// roster.assignmentStream = assignStream._id;
			// roster.assignmentPublics = [
			// 	...(roster.assignmentPublics ?? []),
			// 	assignStream._id,
			// ];
			// await SlideStream.create(listSlideData);
			await roster.save();
		}

		// If dont't have roster group means all student in that class belong to OTHER GROUP
		if (isFull) {
			const classRoomDB = await ClassRoom.findById(classRoom);
			rosterGroup.name = name ?? classRoomDB.name;

			// Get all student active in a classroom
			const studentsInClass = await StudentClassRoom.find({
				isActive: true,
				classRoom: classRoomDB._id,
			}).select('student');
			const studentIdsFull = studentsInClass.map(({ _id }) => _id);

			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterId,
				studentIdsFull
			);

			// if (studentsInOtherGroup.length !== 0) {
			// 	throw new HttpError(
			// 		STUDENT_ARE_IN_OTHER_GROUP,
			// 		400,
			// 		'INVALID_ID_OF_STUDENT',
			// 		{
			// 			invalidStudents: studentsInOtherGroup,
			// 		}
			// 	);
			// }
			rosterGroup.students = studentIdsFull;
		} else {
			rosterGroup.name = name;
			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterId,
				students
			);
			// if (studentsInOtherGroup.length !== 0) {
			// 	throw new HttpError(
			// 		STUDENT_ARE_IN_OTHER_GROUP,
			// 		400,
			// 		'INVALID_ID_OF_STUDENT',
			// 		{
			// 			invalidStudents: studentsInOtherGroup,
			// 		}
			// 	);
			// }
			rosterGroup.students = students;
		}
		await rosterGroup.save();
		return new HttpResponse({ res, data: rosterGroup, statusCode: 201 });
	}

	async updateRosterGroup(req: Request, res: Response, next: NextFunction) {
		const rosterGroupId = req.params.id as string;
		const payload = req.body as Exam.RequestAddNewRosterGroup;
		const rosterGroup = await RosterGroup.findById(rosterGroupId).orFail(
			() => new HttpError(_404, 404)
		);
		if (rosterGroup.status === EnumStatusRosterGroup.Finished) {
			throw new HttpError(
				'Nhóm này đã hoàn thành, không thể chỉnh sửa được.'
			);
		}
		// Update student in Roster Group
		if (payload.isFull) {
			const classRoom = await ClassRoom.findById(payload.classRoom);
			const studentsInClass = await StudentClassRoom.find({
				isActive: true,
				classRoom: classRoom._id,
			}).select('student');
			const studentIdsFull = studentsInClass.map(({ student }) => student);
			// const studentsInOtherGroup = await examService.findStudentInOtherGroup(
			// 	rosterGroup.roster,
			// 	studentIdsFull
			// );
			// if (studentsInOtherGroup.length !== 0) {
			// 	throw new HttpError(
			// 		STUDENT_ARE_IN_OTHER_GROUP,
			// 		400,
			// 		'INVALID_ID_OF_STUDENT',
			// 		{
			// 			invalidStudents: studentsInOtherGroup,
			// 		}
			// 	);
			// }
			payload.students = studentIdsFull;
		} else if (
			typeof payload.isFull === 'boolean' &&
			payload.isFull === false
		) {
			// const studentsInOtherGroup = await examService.findStudentInOtherGroup(
			// 	rosterGroup.roster,
			// 	payload.students
			// );
			// if (studentsInOtherGroup.length !== 0) {
			// 	throw new HttpError(
			// 		STUDENT_ARE_IN_OTHER_GROUP,
			// 		400,
			// 		'INVALID_ID_OF_STUDENT',
			// 		{
			// 			invalidStudents: studentsInOtherGroup,
			// 		}
			// 	);
			// }
			payload.students = payload.students;
		}
		await rosterGroup.updateOne(payload);
		const rosterGroups = await RosterGroup.find({
			roster: rosterGroup.roster,
			status: {
				$in: [EnumStatusRosterGroup.Ready, EnumStatusRosterGroup.Online],
			},
		});
		// If length == 0 means all of these are Finished
		if (rosterGroups.length === 0) {
			await Roster.findByIdAndUpdate(rosterGroup.roster, {
				status: EnumStatusRoster.Offline,
			});
		}

		return new HttpResponse({ res, data: rosterGroup, statusCode: 200 });
	}

	async deleteRosterGroup(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const query = req.query;
		const { mode } = query;
		const rosterGroup = await RosterGroup.findById(id);
		if (mode === 'safe') {
			if (rosterGroup.status === EnumStatusRosterGroup.Online) {
				throw new HttpError(
					'Nhóm này đang online, bạn phải `Kết thúc` trước khi xóa.'
				);
			}
			await rosterGroup.delete();
		} else {
			const rosterGroup = await RosterGroup.findById(id);
			await RosterGroup.deleteById(id);
		}
		const rosterGroups = await RosterGroup.find({
			roster: rosterGroup.roster,
			status: {
				$in: [EnumStatusRosterGroup.Ready, EnumStatusRosterGroup.Online],
			},
		});
		// If length == 0 means all of these are Finished or don't have any
		if (rosterGroups.length === 0) {
			await Roster.findByIdAndUpdate(rosterGroup.roster, {
				status: EnumStatusRoster.Offline,
			});
		}
		return res.sendStatus(204);
	}

	async getExamForStudent(req: Request, res: Response, next: NextFunction) {
		const { user, query } = req;
		const belongClassRooms = await StudentClassRoom.find({
			isActive: true,
			student: user._id,
		}).select('_id');
		const type = query.type;
		switch (type) {
			case 'todo':
				const mystudentsId = belongClassRooms.map(({ _id }) => _id);
				const todoExams = await examService.getToDoExam(mystudentsId);
				return new HttpResponse({ res, data: todoExams });
			case 'finish':
				// const mystudentsId = belongClassRooms.map(({ _id }) => _id);
				// const todoExams = await examService.getToDoExam(mystudentsId);
				return new HttpResponse({ res, data: todoExams });
			default:
				throw new HttpError(
					'Invalid query type: ' + query.type,
					400,
					'BAD_QUERY'
				);
		}
	}
}

export default new ExamController();
