import { Express, NextFunction, Request, Response } from 'express';

import { PREFIX_API_V1 } from '../config/key';
import fs from 'fs';

const makeRoutes = (app: Express) => {
	app.get('/', (_req: Request, res: Response) => {
		res.send('Success');
	});

	app.use(PREFIX_API_V1, (req, res, next) => {
		const { signedCookies } = req;
		if (signedCookies['_token']) {
			req.headers.authorization = 'Bearer ' + signedCookies['_token'];
		}
		next();
	});

	const files = fs.readdirSync(__dirname);
	const routerFiles = files.filter((file) => file.endsWith('.route.js'));
	Promise.all(routerFiles.map((routerFile) => import(`./${routerFile}`)))
		.then((modules) =>
			modules.forEach((module) => app.use(PREFIX_API_V1, module.default))
		)
		.then(() => {
			app.get('*', (req, res) => {
				return res.status(404).json({
					isSuccess: false,
					error: 'Not found this route.',
				});
			});

			app.use(
				(error: any, req: Request, res: Response, next: NextFunction) => {
					return res.status(error.status || 500).json({
						isSuccess: false,
						error: error.message,
						stacks: error.stack,
					});
				}
			);
		});
};

export default makeRoutes;
