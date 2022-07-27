import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '../config/key';

import mongoose from 'mongoose';

export const connectMongoDB = () => {
	mongoose.connection.on('connected', () => {
		console.log('[mongodb] connected success');
	});
	mongoose.connection.on('error', (error) => {
		console.log('[mongodb] connected error ' + error);
	});
	mongoose.connection.on('disconnected', () => {
		console.log('[mongodb] disconnected');
	});
	return mongoose.connect(DB_HOST, {
		autoIndex: true,
		autoCreate: true,
		user: DB_USER,
		pass: DB_PASSWORD,
		dbName: DB_NAME,
		connectTimeoutMS: 1000,
	});
};
