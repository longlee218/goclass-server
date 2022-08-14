import { NextFunction, Request, Response } from 'express';

import Assignment from '../../models/assignment.model';
import { AssignmentFolder } from '../../models';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import Slide from '../../models/slides.model';
import { Types } from 'mongoose';
import assignmentService from './assignment.service';

export class AssignmentController extends BaseController {
	async createFolder(req: Request, res: Response, next: NextFunction) {
		const parentId = req.params?.parentId;
		const name = req.body.name as string;
		const listName = name.split(',');
		const folder = parentId
			? await AssignmentFolder.findOne({
					_id: parentId,
					owner: req.user._id,
			  })
			: null;
		await AssignmentFolder.create(
			listName
				.filter((e) => e)
				.map((name) => ({
					name,
					parentId: parentId || null,
					owner: req.user._id,
					belongs: folder ? [...folder.belongs, folder._id] : [],
				}))
		);
		return res.sendStatus(201);
	}

	async editFolder(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		await AssignmentFolder.updateOne(
			{
				_id: id,
			},
			req.body
		);
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
		const parentId = req.query.parentId;
		const assignId = new Types.ObjectId();

		const folder = parentId
			? await AssignmentFolder.findOne({
					_id: parentId,
					owner: req.user._id,
			  })
			: null;

		const listSlideData = new Array(4).map((_: unknown, i: number) => ({
			_id: new Types.ObjectId(),
			background: '',
			content: '',
			sticker: '',
			work: '',
			order: i + 1,
			points: 0,
			assignment: assignId,
		}));
		await Slide.create(listSlideData);
		const assignment = await Assignment.create({
			_id: assignId,
			name: 'Bài tập mới',
			owner: req.user._id,
			parentId: parentId || null,
			slideCounts: listSlideData.length,
			slides: listSlideData.map(({ _id }) => _id),
			belongs: folder ? [...folder.belongs, folder._id] : [],
		});
		return new HttpResponse({ res, data: assignment });
	}
}

export default new AssignmentController();
