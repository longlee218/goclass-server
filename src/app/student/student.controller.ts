import { ClassRoom, StudentClassRoom } from '../../models';
import { NextFunction, Request, Response } from 'express';

import HttpResponse from '../../utils/HttpResponse';
import { Student } from '../../types/request';
import studentService from './student.service';

class StudentController {
	async addNewStudent(req: Request, res: Response, next: NextFunction) {
		const payload = req.body as Student.RequestAddStudent;
		const classId = req.params.classId as string;
		const classRoom = await ClassRoom.findByIdOrFail(classId);
		await studentService.createStudent(payload, classRoom._id);
		return res.sendStatus(201);
	}

	async editStudent(req: Request, res: Response, next: NextFunction) {
		const payload = req.body as Student.RequestUpdateStudent;
		const classId = req.params.classId as string;
		const classRoom = await ClassRoom.findByIdOrFail(classId);
		await studentService.updateStudent(payload, classRoom._id);
		return res.sendStatus(204);
	}

	async getStudentOfClass(req: Request, res: Response, next: NextFunction) {
		const classId = req.params.classId as string;
		const page = req.query.page as unknown as number;
		const limit = req.query.limit as unknown as number;
		const sortField = (req.query.sortField as string) || 'createdAt';
		const sortOrder = (req.query.sortOrder as string) || 'descend';
		delete req.query.page;
		delete req.query.limit;
		delete req.query.sortField;
		delete req.query.sortOrder;
		const results = await studentService.getStudentOfClass(
			classId,
			req.query,
			sortField,
			sortOrder,
			page || 1,
			limit || 10
		);
		return new HttpResponse({ res, data: results });
	}

	async deleteStudent(req: Request, res: Response, next: NextFunction) {
		const idRecord = req.params.id;
		const classId = req.params.classId;
		await ClassRoom.findByIdOrFail(classId);
		await StudentClassRoom.deleteById(idRecord);
		return res.sendStatus(204);
	}
}

export default new StudentController();
