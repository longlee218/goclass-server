import { NextFunction, Request, Response } from 'express';

import HttpError from '../utils/HttpError';
import { Types } from 'mongoose';

const validId = (req: Request, res: Response, next: NextFunction) => {
	const params = req.params;
	for (const key in params) {
		const value = params[key];
		if (key.toLowerCase().includes('id')) {
			if (!Types.ObjectId.isValid(value)) {
				const error = new HttpError(
					key + ' không hợp lệ.',
					400,
					'INVALID_ID'
				);
				next(error);
			}
		}
	}
	next();
};
export default validId;
