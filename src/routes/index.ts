import { Express } from 'express';
import { PREFIX_API_V1 } from '../config/key';
import fs from 'fs';

const makeRoutes = (app: Express) => {
	app.use(PREFIX_API_V1, (req, res, next) => {
		const { signedCookies } = req;
		if (signedCookies['_token']) {
			req.headers.authorization = 'Bearer ' + signedCookies['_token'];
		}
		next();
	});

	const files = fs.readdirSync(__dirname);
	const routerFiles = files.filter((file) => file.endsWith('.route.js'));
	routerFiles.forEach((routerFile) => {
		app.use(PREFIX_API_V1, require(`./${routerFile}`).default);
	});
};

export default makeRoutes;
