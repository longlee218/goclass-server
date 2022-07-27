import { NextFunction, Request, Response } from 'express';

import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import class_roomService from './class_room.service';

export class ClassRoom extends BaseController {
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
}

export default new ClassRoom();
