import { NextFunction, Request, Response } from 'express';

import HttpError from '../utils/HttpError';
import Joi from 'joi';
import Schemas from '../schemas';

export default (isUseJoiError: boolean = true) => {
	const supportHttpMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
	const validateOptions: Joi.ValidationOptions = {
		abortEarly: false, // abort after the last validation error
		allowUnknown: true, // allow unknown keys that will be ignored
		stripUnknown: true, // remove unknown keys from the validated data
		dateFormat: 'string',
		errors: {
			language: 'vn',
		},
	};
	return (req: Request, res: Response, next: NextFunction) => {
		const path: string = req.route.path;
		const method = req.method.toUpperCase();
		if (
			supportHttpMethods.includes(method) &&
			Schemas.hasOwnProperty(method + path)
		) {
			const schema = Schemas[method + path];
			if (schema) {
				const { error, value } = schema.validate(req.body, validateOptions);
				if (error) {
					const httpError = new HttpError(
						error.details[0].message,
						422,
						'ValidateError'
					);
					const joiError = {
						isSuccess: false,
						message: error.details[0].message,
						error: httpError,
						stacks: httpError.stack,
						// error: {
						// 	// original: error._original,
						// 	// details: error.details.map(({ path, type, message }) => ({
						// 	// 	type,
						// 	// 	message: message.replace(/['"]/g, ''),
						// 	// 	path,
						// 	// })),
						// },
					};
					return res.status(422).json(joiError);
				} else {
					req.body = value;
					next();
				}
			} else {
				return res
					.status(500)
					.json({ isSuccess: false, message: 'Not found schema.' });
			}
		} else {
			next();
		}
	};
};
