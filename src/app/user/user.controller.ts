import { NextFunction, Request, Response } from 'express';

import HttpError from '../../utils/HttpError';
import HttpResponse from '../../utils/HttpResponse';
import { User } from '../../models';
import { _404 } from '../../config/message_code';

class UserController {
	public async getProfile(req: Request, res: Response, next: NextFunction) {
		return res.status(200).json({ profile: req.user });
	}

	async finByUserId(req: Request, res: Response, next: NextFunction) {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new HttpError(_404, 404);
		}
		return new HttpResponse({ res, data: user });
	}
}

export default new UserController();
