import ExpressServer from './utils/ExpressServer';
import SocketServer from './utils/Socket';
import { connectMongoDB } from './services/db.service';
import dotenv from 'dotenv';
import http from 'http';
import { normalizePort } from './helpers/server.helper';
import passportService from './services/passport.service';
import path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

/**
 * App Variables
 */
const port = normalizePort(process.env.PORT || '8080');
const app = ExpressServer(port);
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
 *  Socket server
 */
const socket = SocketServer(httpServer);
/**
 * Connect database
 */
connectMongoDB();
passportService();

process.on('uncaughtException', (err) => {
	console.log('Error process: ' + err);
});
