import { ClassRoom, Organization, User } from '../../models';
import { NextFunction, Request, Response } from 'express';

import Assignment from '../../models/assignment.model';
import AssignmentStream from '../../models/assignment_stream.model';
import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import { loadFromFirebase } from '../../utils/Firebase';

export class OtherController extends BaseController {
	constructor() {
		super();
	}

	async paginateOrganization(req: Request, res: Response, next: NextFunction) {
		const query = req.query;
		const { page, limit, sort, search } = query;
		const results = await Organization.paginate(
			{
				name: {
					$regex: new RegExp((search as unknown as string) || ''),
					$options: 'i',
				},
			},
			{
				page: (page as unknown as number) || 1,
				limit: (limit as unknown as number) || 10,
				sort: sort || 'name',
			}
		);
		return res.json(results);
	}

	async paginateEmail(req: Request, res: Response, next: NextFunction) {
		const query = req.query;
		const { page, limit, sort, search } = query;
		const results = await User.paginate(
			{
				email: {
					$regex: new RegExp((search as unknown as string) || ''),
					$options: 'i',
				},
				_id: {
					$ne: req.user._id,
				},
			},
			{
				page: (page as unknown as number) || 1,
				limit: (limit as unknown as number) || 6,
				sort: sort || 'name',
			}
		);
		return res.json(results);
	}

	async isExistEmail(req: Request, res: Response, next: NextFunction) {
		const query = req.query;
		const check = await User.exists({ email: query.email });
		return res.json({ isExist: !!check });
	}

	async queryAllApp(req: Request, res: Response, next: NextFunction) {
		const q = req.query.q;
		const response: Array<{
			heading: string;
			items: Array<{
				decorator?: string;
				content: string;
				link: string;
				extra?: string;
			}>;
		}> = [];

		//find classroom
		const classRooms = await ClassRoom.find({
			ownerId: req.user,
			name: {
				$regex: new RegExp((q as unknown as string) || ''),
				$options: 'i',
			},
		})
			.populate('classRoomGroupId')
			.limit(3)
			.sort('name');

		if (classRooms.length !== 0) {
			response.push({
				heading: 'LỚP HỌC',
				items: classRooms.map((classRoom) => ({
					content: classRoom.name,
					link: '/my-class/?q=' + classRoom.name,
					extra: (classRoom.classRoomGroupId as any).name,
					decorator: `<div class='color-circle' style="background-color: ${classRoom.color}"></div>`,
				})),
			});
		}

		//find assigments
		const assigments = await Assignment.find({
			owner: req.user._id,
			name: {
				$regex: new RegExp((q as unknown as string) || ''),
				$options: 'i',
			},
		})
			.limit(3)
			.sort('name');
		if (assigments.length !== 0) {
			response.push({
				heading: 'BÀI TẬP',
				items: assigments.map((assigment) => ({
					content: assigment.name,
					link:
						'/store-assignments/' +
						(assigment.parentId ? assigment.parentId.toString() : '') +
						'?q=' +
						assigment.name,
				})),
			});
		}

		const libraries = await AssignmentStream.find({
			name: {
				$regex: new RegExp((q as unknown as string) || ''),
				$options: 'i',
			},
		})
			.limit(3)
			.sort('-createdAt');
		if (libraries.length !== 0) {
			response.push({
				heading: 'THƯ VIỆN',
				items: libraries.map((library) => ({
					content: library.name,
					link: '/lib-assignments/' + library._id,
					extra: library.downloads + ' lượt tải',
				})),
			});
		}

		return new HttpResponse({ res, data: response });
	}

	async test(req: Request, res: Response, next: NextFunction) {
		const elements = await loadFromFirebase(
			'7f5adfceca6b06be18b4',
			'1xldzH3N-Ik16HwT7y4udw'
		);
		return res.json(elements);
	}
}

export default new OtherController();
