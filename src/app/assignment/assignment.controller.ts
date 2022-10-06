import { AssignmentFolder, User } from '../../models';
import AssignmentWork, {
	IAssignmentWorkDocument,
} from '../../models/assignment_work.model';
import { NextFunction, Request, Response } from 'express';

import Assignment from '../../models/assignment.model';
import AssignmentStream from '../../models/assignment_stream.model';
import BaseController from '../../core/base.controller';
import { EnumStatusRoster } from '../../config/enum';
import HttpResponse from '../../utils/HttpResponse';
import Library from '../../models/library.model';
import Roster from '../../models/roster.model';
import RosterGroup from '../../models/roster_group.model';
import Slide from '../../models/slides.model';
import SlideStream from '../../models/slides_stream.model';
import { Types } from 'mongoose';
import assignmentService from './assignment.service';
import examService from '../exam/exam.service';

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
		const { assignWorkId, slideId, userId } = req.query;
		const user = await User.findById(userId);
		const assignWork = await AssignmentWork.findById(assignWorkId);
		console.log(assignWork);
		const isSupport = assignWork.workBy.toString() === userId;
		const rosterGroup = await RosterGroup.findById(assignWork.rosterGroupId);

		const selectStr = rosterGroup.isShowResult
			? 'name desc points'
			: 'name desc';

		const slide = await Slide.findById(slideId).select(selectStr);
		if (!assignWork) {
			return new HttpResponse({
				res,
				data: {
					user,
					numSlide: 1,
					isSupport,
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
						assignWorkId as string,
						userId as string
				  );
		const prevUrl =
			index === 0
				? null
				: examService.makeLinkEditor(
						slideIds[index - 1],
						assignWork.encryptKey,
						assignWorkId as string,
						userId as string
				  );
		return new HttpResponse({
			res,
			data: {
				user,
				isSupport,
				numSlide: index + 1,
				...slide.toJSON(),
				prevUrl,
				nextUrl,
			},
		});
	}

	async downloadAssignment(req: Request, res: Response, next: NextFunction) {
		const { user } = req;
		const assignmentId = req.params.id;
		const assginStream = await AssignmentStream.findById(assignmentId);
		if (!assginStream) {
			return res.sendStatus(404);
		}
		const folderName = 'Downloads';
		let folder = await AssignmentFolder.findOne({
			owner: user._id,
			name: folderName,
		});
		if (!folder) {
			folder = (
				await assignmentService.createFolder(folderName, null, user)
			).pop();
		}
		const slideStreams = await SlideStream.find({ assignment: assignmentId });
		const assignId = new Types.ObjectId();
		const listSlideData = slideStreams.map(
			({
				name,
				elements,
				appState,
				files,
				order,
				points,
				desc,
				thumbnail,
			}) => {
				return {
					_id: new Types.ObjectId(),
					name,
					elements,
					appState,
					files,
					order,
					points,
					desc,
					thumbnail,
					assignment: assignId,
				};
			}
		);
		await Slide.create(listSlideData);
		const roster = await Roster.create({
			status: EnumStatusRoster.Offline,
			assignment: assignId,
		});
		const assignment = await Assignment.create({
			_id: assignId,
			name: assginStream.name,
			grades: assginStream.grades,
			subjects: assginStream.subjects,
			owner: user._id,
			parentId: folder._id,
			slideCounts: listSlideData.length,
			slides: listSlideData.map(({ _id }) => _id),
			belongs: [folder._id],
			roster: roster._id,
		});
		assginStream.downloads += 1;
		await assginStream.save();
		return new HttpResponse({ res, data: assignment });
	}
}

export default new AssignmentController();
