import { NextFunction, Request, Response } from 'express';

import BaseController from '../../core/base.controller';
import { ClassRoom } from '../../models';
import HttpResponse from '../../utils/HttpResponse';
import class_roomService from './class_room.service';

export class ClassRoomController extends BaseController {
	constructor() {
		super();
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
		return new HttpResponse({ res, data: newClass });
	}
}

export default new ClassRoomController();
