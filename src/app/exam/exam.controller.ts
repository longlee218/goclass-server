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
	}

	async createRosterGroup(req: Request, res: Response, next: NextFunction) {
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
		rosterGroup.status = EnumStatusRoster.Online;
		rosterGroup.isShowResult = isShowResult;
		rosterGroup.isBlock = isBlock;
		rosterGroup.isCanHelp = isCanHelp;
		rosterGroup.isHide = isHide;
		rosterGroup.isSuffer = isSuffer;

		// If roster is Offline then make it Online
		if (roster.status === EnumStatusRoster.Offline) {
			roster.status = EnumStatusRoster.Online;
			// Make assign_stream and slide_stream depended on assignId
			const { assignmentData, listSlideData } =
				await assignmentService.makeCopyAssignmentData(
					roster.assignment,
					req.user,
					''
				);
			const assignStream = await AssignmentStream.create(assignmentData);
			roster.assignmentStream = assignStream._id;
			await SlideStream.create(listSlideData);
			await roster.save();
		}

		// If dont't have roster group means all student in that class belong to OTHER GROUP
		if (isFull) {
			const classRoomDB = await ClassRoom.findById(classRoom);
			rosterGroup.name = name || classRoomDB.name;
			const studentsInClass = await StudentClassRoom.find({
				isActive: true,
				classRoom: classRoomDB._id,
			}).select('student');
			const studentIdsFull = studentsInClass.map(({ student }) => student);
			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterId,
				studentIdsFull
			);
			if (studentsInOtherGroup.length !== 0) {
				throw new HttpError(
					STUDENT_ARE_IN_OTHER_GROUP,
					400,
					'INVALID_ID_OF_STUDENT',
					{
						invalidStudents: studentsInOtherGroup,
					}
				);
			}
			rosterGroup.students = studentIdsFull;
		} else {
			rosterGroup.name = name;
			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterId,
				students
			);
			if (studentsInOtherGroup.length !== 0) {
				throw new HttpError(
					STUDENT_ARE_IN_OTHER_GROUP,
					400,
					'INVALID_ID_OF_STUDENT',
					{
						invalidStudents: studentsInOtherGroup,
					}
				);
			}
			rosterGroup.students = students;
		}
		await rosterGroup.save();
		return new HttpResponse({ res, data: rosterGroup, statusCode: 201 });
	}

	async updateRosterGroup(req: Request, res: Response, next: NextFunction) {
		const rosterGroupId = req.params.id;
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
			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterGroup.roster,
				studentIdsFull
			);
			if (studentsInOtherGroup.length !== 0) {
				throw new HttpError(
					STUDENT_ARE_IN_OTHER_GROUP,
					400,
					'INVALID_ID_OF_STUDENT',
					{
						invalidStudents: studentsInOtherGroup,
					}
				);
			}
			payload.students = studentIdsFull;
		} else if (
			typeof payload.isFull === 'boolean' &&
			payload.isFull === false
		) {
			const studentsInOtherGroup = await examService.findStudentInOtherGroup(
				rosterGroup.roster,
				payload.students
			);
			if (studentsInOtherGroup.length !== 0) {
				throw new HttpError(
					STUDENT_ARE_IN_OTHER_GROUP,
					400,
					'INVALID_ID_OF_STUDENT',
					{
						invalidStudents: studentsInOtherGroup,
					}
				);
			}
			payload.students = payload.students;
		}
		await rosterGroup.updateOne(payload);
		return new HttpResponse({ res, data: rosterGroup, statusCode: 200 });
	}
}

export default new ExamController();
