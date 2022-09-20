import multer from 'multer';

const multerConfig: multer.Options = {
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, './public');
		},
		filename: function (req, file, cb) {
			const [, fileType] = file.originalname.split('.');
			const uniqueSuffix =
				Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + fileType;
			cb(null, file.fieldname + '-' + uniqueSuffix);
		},
	}),
};

export default multerConfig;
