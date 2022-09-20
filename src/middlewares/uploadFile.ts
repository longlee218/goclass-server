import multer from 'multer';
import multerConfig from '../config/multer';

export const uploadFile = multer(multerConfig).fields([
	{
		name: 'files',
		maxCount: 5,
	},
]);
