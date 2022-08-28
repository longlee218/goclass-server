import { ClassRoom, StudentClassRoom } from '../../models';
import { NextFunction, Request, Response } from 'express';
import {
	STUDENT_ARE_IN_OTHER_GROUP,
	_200,
	_400,
} from '../../config/message_code';

import AssignmentStream from '../../models/assignment_stream.model';
import { EnumStatusRoster } from '../../config/enum';
import { Exam } from '../../types/request';
import HttpError from '../../utils/HttpError';
import Roster from '../../models/roster.model';
import RosterGroup from '../../models/roster_group.model';
import SlideStream from '../../models/slides_stream.model';
import assignmentService from '../assignment/assignment.service';

class ExamController {
	async getAllRosterGroup() {}

	async createRosterGroup(req: Request, res: Response, next: NextFunction) {
		const rosterId = req.params.id;
		const roster = await Roster.findByIdOrFail(rosterId);
		const {
			classRoomId,
			rosterGroupName,
			isShowResult,
			studentIds,
			isBlock,
			isCanHelp,
			isSuffer,
			isHide,
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
			await SlideStream.create(listSlideData);
			roster.assignmentStream = assignStream._id;
			await roster.save();
		}

		// If dont't have roster group means all student in that class belong to OTHER GROUP
		if (!rosterGroupName || rosterGroupName === 'null') {
			const classRoom = await ClassRoom.findById(classRoomId);
			rosterGroup.name = classRoom.name;
			const studentsInClass = await StudentClassRoom.find({
				isActive: true,
				classRoom: classRoomId,
			}).select('student');
			rosterGroup.students = studentsInClass.map(({ student }) => student);
		} else {
			rosterGroup.name = rosterGroupName;
			rosterGroup.students = studentIds;
		}
	}

	async checkValidStudent(req: Request, res: Response, next: NextFunction) {
		const { rosterId, studentId } = req.body;
		const rosterGroups = await RosterGroup.find({
			status: EnumStatusRoster.Online,
			roster: rosterId,
		});
		const listStudents = rosterGroups.reduce((prev, current) => {
			prev = [...prev, ...current.students];
			return prev;
		}, []);

		if (listStudents.includes(studentId)) {
			throw new HttpError(
				STUDENT_ARE_IN_OTHER_GROUP,
				400,
				'INVALID_STUDENT_ID'
			);
		}
		return res.status(200).send(_200);
	}
}

export default new ExamController();
