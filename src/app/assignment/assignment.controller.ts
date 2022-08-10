import { NextFunction, Request, Response } from 'express';

import { AssignmentFolder } from '../../models';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import assignmentService from './assignment.service';

export class AssignmentController extends BaseController {
	async createCategories(req: Request, res: Response, next: NextFunction) {
		await AssignmentFolder.create({
			name: req.body.name,
			parentId: req.params?.parentId || null,
			owner: req.user._id,
		});
		return res.sendStatus(201);
	}

	async getCategoriesAndAssingments(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const results = await assignmentService.getFolderAndAssignment(
			req.params.parentId as string,
			req.user
		);
		return new HttpResponse({ res, data: results });
	}
}

export default new AssignmentController();
