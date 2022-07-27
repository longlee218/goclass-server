import express, { Express, NextFunction, Request, Response } from 'express';

import CatchAsync from './utils/CatchAsync';
import { PREFIX_API_V1 } from './config/key';
import { ROUTES } from './config/constant';
import authController from './app/auth/auth.controller';
import authRoute from './routes/auth.route';
import bodyParser from 'body-parser';
import { connectMongoDB } from './services/db.service';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import makeRoutes from './routes';
import passport from 'passport';
import passportService from './services/passport.service';
import path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

const normalizePort = (val: string) => {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

/**
 * App Variables
 */
const port = normalizePort(process.env.PORT || '8080');
const app: Express = express();
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListenning = () => {
	const addr = httpServer.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('[express] listening on ' + bind);
};

/**
 * Server Activation
 */
const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('listening', onListenning);
httpServer.on('error', onError);

/**
 * Connect database
 */
connectMongoDB();
passportService();

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
app.get('*', function (req, res, next) {
	return res.status(404).json({
		isSuccess: false,
		error: 'Not found this route.',
	});
});

/**
 * Catch error process
 */
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	return res.status(error.status || 500).json({
		isSuccess: false,
		error: error.message,
		stacks: error.stack,
	});
});

process.on('uncaughtException', (err) => {
	console.log('Error process: ' + err);
});
