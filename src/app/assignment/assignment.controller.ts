import { NextFunction, Request, Response } from 'express';

import { AssignmentFolder } from '../../models';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import Library from '../../models/library.model';
import Roster from '../../models/roster.model';
import { Types } from 'mongoose';
import assignmentService from './assignment.service';
import Slide from '../../models/slides.model';
import AssignmentWork from '../../models/assignment_work.model';
import examService from '../exam/exam.service';
import RosterGroup from '../../models/roster_group.model';

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

	async getSharedAssignments(req: Request, res: Response, next: NextFunction) {
		const { query } = req;
		const assignments = await assignmentService.getSharedAssignments(query);
		return new HttpResponse({ res, data: assignments });
	}

	async findSharedAssignment(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const assignment = await assignmentService.findSharedAssignment(
			id as string
		);
		return new HttpResponse({ res, data: assignment });
	}

	async getAllLibraries(req: Request, res: Response, next: NextFunction) {
		const libraryItems = await Library.find({ user: req.user._id });
		return new HttpResponse({ res, data: libraryItems });
	}

	async findAssignment(req: Request, res: Response, next: NextFunction) {
		const id = String(req.params.id);
		const assignment = await assignmentService.findAssignmentById(id);
		return new HttpResponse({ res, data: assignment });
	}

	async editAssignment(req: Request, res: Response, next: NextFunction) {
		const id = String(req.params.id);
		const assignment = await assignmentService.updateById(req.body, id);
		// const roster = await Roster.findById(assignment.roster);
		return new HttpResponse({ res, data: assignment });
	}

	async deleteAssignment(req: Request, res: Response, next: NextFunction) {
		const id = String(req.params.id);
		await assignmentService.deleteById(id);
		return res.sendStatus(204);
	}

	async duplicateAssignment(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id as string;
		const assignCopy = await assignmentService.copyAssignment(id, req.user);
		return new HttpResponse({ res, data: assignCopy });
	}

	async loadHints(req: Request, res: Response, next: NextFunction) {
		const { rosterGroupId, slideId, userId } = req.query;
		const assignWork = await AssignmentWork.findOne({
			rosterGroupId,
			workBy: userId,
		});
		const rosterGroup = await RosterGroup.findById(rosterGroupId);

		const slide = rosterGroup.isShowResult
			? await Slide.findById(slideId).select('name desc points')
			: await Slide.findById(slideId).select('name desc');
		if (!assignWork) {
			return new HttpResponse({
				res,
				data: {
					numSlide: 1,
					...slide.toJSON(),
					prevUrl: null,
					nextUrl: null,
				},
			});
		}
		const slideIds = assignWork.slideIds.map((e) => e.toString());
		const index = slideIds.indexOf(slideId as string);
		const nextUrl =
			index === slideIds.length - 1
				? null
				: examService.makeLinkEditor(
						slideIds[index + 1],
						assignWork.encryptKey,
						rosterGroupId as string,
						userId as string
				  );
		const prevUrl =
			index === 0
				? null
				: examService.makeLinkEditor(
						slideIds[index - 1],
						assignWork.encryptKey,
						rosterGroupId as string,
						userId as string
				  );
		return new HttpResponse({
			res,
			data: {
				numSlide: index + 1,
				...slide.toJSON(),
				prevUrl,
				nextUrl,
			},
		});
	}
}

export default new AssignmentController();
