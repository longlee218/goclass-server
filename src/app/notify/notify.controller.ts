import { NextFunction, Request, Response } from 'express';
import { _200, _400, _404 } from '../../config/message_code';

import BaseController from '../../core/base.controller';
import HttpResponse from '../../utils/HttpResponse';
import Notify from '../../models/notify.model';

class NotifyController extends BaseController {
	async getAllNotify(req: Request, res: Response, next: NextFunction) {
		const results = await Notify.paginate(
			{
				recievers: req.user._id,
			},
			{
				page: 1,
				limit: 5,
				sort: '-createdAt',
				select: '-recievers',
				populate: {
					path: 'createdBy',
					select: 'fullname',
				},
			}
		);
		return new HttpResponse({ res, data: results, statusCode: 201 });
	}
}

export default new NotifyController();
