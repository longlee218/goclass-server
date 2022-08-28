import express, { Express, NextFunction, Request, Response } from 'express';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from '../cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import makeRoutes from '../routes';
import passport from 'passport';
import path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

function ExpressServer(port: number | string | boolean) {
	const app: Express = express();
	app.set('port', port);

	/**
	 *  App Configuration
	 */
	app.use(passport.initialize());
	app.use(helmet());
	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser(process.env.SESSION_SECRECT));

	// app.use((req, res, next) => {
	// 	res.append('Access-Control-Allow-Origin', ['*']);
	// 	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	// 	res.append('Access-Control-Allow-Headers', 'Content-Type');
	// 	res.setHeader('Content-Type', 'application/json');
	// 	next();
	// });

	/**
	 * Server Routes
	 */
	makeRoutes(app);
	return app;
}

export default ExpressServer;
