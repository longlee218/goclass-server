import { ClassRoom, StudentClassRoom } from '../../models';
import { NextFunction, Request, Response } from 'express';

import BaseController from '../../core/base.controller';
import ClassRoomAlert from '../../models/class_room_alert.model';
import HttpResponse from '../../utils/HttpResponse';
import Notify from '../../models/notify.model';
import class_roomService from './class_room.service';

export class ClassRoomController extends BaseController {
	constructor() {
		super();
	}

	async find(req: Request, res: Response, next: NextFunction) {
		const result = await ClassRoom.findByIdOrFail(req.params.id);
		return new HttpResponse({ res, data: result });
	}

	async get(req: Request, res: Response, next: NextFunction) {
		const results = await class_roomService.getClassAndGroupRoomMapping(
			req.user
		);
		return new HttpResponse({ res, data: results });
	}

	async create(req: Request, res: Response, next: NextFunction) {
		const payload = req.body;
		const newRoom = await class_roomService.createNewRoom(req.user, payload);
		return new HttpResponse({ res, data: newRoom });
	}

	async update(req: Request, res: Response, next: NextFunction) {
		const payload = req.body;
		const id = req.params.id as string;
		const updatedRoom = await class_roomService.updateRoom(
			id,
			req.user,
			payload
		);
		return new HttpResponse({ res, data: updatedRoom });
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id as string;
		await class_roomService.deleteRoom(id, req.user);
		return res.sendStatus(204);
	}

	async duplicate(req: Request, res: Response, next: NextFunction) {
		const id = req.body.id as string;
		const payload = await class_roomService.copyRoom(id, req.user);
		const newClass = await ClassRoom.create({
			...payload,
			name: payload.name + ' (copy)',
		});
		const students = await StudentClassRoom.find({ classRoom: id });
		const payloadStudent = students.map((value) => ({
			student: value.student,
			classRoom: newClass.id,
			isActive: value.isActive,
			studentCode: value.studentCode,
			dob: value.dob,
			studentName: value.studentName,
			email: value.email,
			gender: value.gender,
		}));
		await StudentClassRoom.create(payloadStudent);
		return new HttpResponse({ res, data: newClass });
	}

	async addNewSession(req: Request, res: Response, next: NextFunction) {
		const payload = req.body;
		const promiseActions = payload.map((item: any) => {
			const newSession = class_roomService.increaSession(item.session);
			return ClassRoom.updateOne(
				{ _id: item._id },
				{ name: item.name, session: newSession }
			);
		});
		await Promise.all(promiseActions);
		res.sendStatus(201);
	}

	async createAlert(req: Request, res: Response, next: NextFunction) {
		const classRoomId = req.params.id;
		const payload = req.body;
		const notify = await ClassRoomAlert.create({
			...payload,
			classRoomId,
			createdBy: req.user._id,
		});
		return new HttpResponse({ res, data: notify });
	}

	async getAlert(req: Request, res: Response, next: NextFunction) {
		const classRoomId = req.params.id;
		const notify = await ClassRoomAlert.find({
			createdBy: req.user._id,
			classRoomId: classRoomId,
		})
			.sort('-createdAt')
			.populate({
				path: 'createdBy',
				select: 'fullname avatar',
			});
		return new HttpResponse({ res, data: notify });
	}
}

export default new ClassRoomController();
