import { NextFunction, Request, Response } from 'express';

import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import class_groupService from './class_group.service';

export class ClassGroupController extends BaseController {
	constructor() {
		super();
	}

	async create(req: Request, res: Response, next: NextFunction) {
		const { name } = req.body;
		const result = await class_groupService.createNewGroup(
			name as string,
			req.user
		);
		return new HttpResponse({ res, data: result, statusCode: 201 });
	}

	async get(req: Request, res: Response, next: NextFunction) {
		const results = await class_groupService.getAllGroups(req.user);
		return new HttpResponse({ res, data: results });
	}

	async update(req: Request, res: Response, next: NextFunction) {
		const payload = req.body;
		const { params } = req;
		const result = await class_groupService.updateGroup(
			params.id,
			req.user,
			payload
		);
		return new HttpResponse({ res, data: result });
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		const { params } = req;
		await class_groupService.deleteGroup(params.id, req.user);
		return res.sendStatus(204);
	}
}

export default new ClassGroupController();
