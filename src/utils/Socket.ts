import http from 'http';
import { instrument } from '@socket.io/admin-ui';
import notifySocket from '../socket/notify.socket';
import slideSocket from '../socket/slide.socket';
import socket from 'socket.io';

function SocketServer(httpServer: http.Server) {
	const io = new socket.Server(httpServer, {
		path: '/socket',
		cors: {
			credentials: true,
			origin: ['http://localhost:3001', 'https://admin.socket.io'],
		},
	});
	io.on('connection', (socket) => {
		console.log('a user connected');

		socket.on('ping', () => {
			console.log('Server receive ping');
		});

		socket.on('disconnect', () => {
			console.log('Oops someone leave');
		});
	});

	io.of('/slide').on('connection', slideSocket);
	io.of('/notify').on('connection', notifySocket);

	instrument(io, { auth: false });
	return io;
}

export default SocketServer;
