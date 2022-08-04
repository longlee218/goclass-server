import { NextFunction, Request, Response } from 'express';
import { Organization, User } from '../../models';

import BaseController from '../../core/base.controller';

export class OtherController extends BaseController {
	constructor() {
		super();
	}

	private _makeOptions(
		searchField: string = 'name',
		page: unknown,
		limit: unknown
	) {}

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
			},
			{
				page: (page as unknown as number) || 1,
				limit: (limit as unknown as number) || 10,
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
}

export default new OtherController();
