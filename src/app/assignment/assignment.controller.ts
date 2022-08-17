import { NextFunction, Request, Response } from 'express';

import { AssignmentFolder } from '../../models';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import { Types } from 'mongoose';
import assignmentService from './assignment.service';

export class AssignmentController extends BaseController {
	async createFolder(req: Request, res: Response, next: NextFunction) {
		const parentId = req.params?.parentId;
		const name = req.body.name as string;
		await assignmentService.createFolder(name, parentId, req.user);
		return res.sendStatus(201);
	}

	async editFolder(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		await AssignmentFolder.findByIdAndUpdate(id, req.body);
		return res.sendStatus(204);
	}

	async deleteFolder(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		await AssignmentFolder.deleteById(id);
		return res.sendStatus(204);
	}

	async getCategoriesAndAssingments(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const query = req.query;
		const results = await assignmentService.getFolderAndAssignment(
			query,
			req.params.parentId as string,
			req.user
		);
		return new HttpResponse({ res, data: results });
	}

	async getBreadcrumbs(req: Request, res: Response, next: NextFunction) {
		const parentId = req.query.parentId as string;
		const results = await assignmentService.getBreadcrumps(
			parentId ? new Types.ObjectId(parentId) : undefined,
			req.user
		);
		return new HttpResponse({ res, data: results });
	}

	async initAssignment(req: Request, res: Response, next: NextFunction) {
		const parentId = (req.params.parentId as string) || null;
		const assignment = await assignmentService.initBlankAssignment(
			parentId,
			req.user
		);
		return new HttpResponse({ res, data: assignment });
	}

	async findAssignment(req: Request, res: Response, next: NextFunction) {
		const id = String(req.params.id);
		const assignment = await assignmentService.findAssignmentById(id);
		return new HttpResponse({ res, data: assignment });
	}

	async editAssignment(req: Request, res: Response, next: NextFunction) {
		const id = String(req.params.id);
		await assignmentService.updateById(req.body, id);
		const assignment = await assignmentService.findAssignmentById(id);
		return new HttpResponse({ res, data: assignment });
	}
}

export default new AssignmentController();
