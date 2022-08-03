import { NextFunction, Request, Response } from 'express';

import { ClassRoom } from '../../models';
import { Student } from '../../types/request';
import studentService from './student.service';

class StudentController {
	public async addNewStudent(req: Request, res: Response, next: NextFunction) {
		const payload = req.body as Student.RequestAddStudent;
		const classId = req.params.classId as string;
		const classRoom = await ClassRoom.findByIdOrFail(classId);
		await studentService.createStudent(payload, classRoom._id);
		return res.sendStatus(201);
	}
}

export default new StudentController();
