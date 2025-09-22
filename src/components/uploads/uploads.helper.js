import multer from 'multer';

export const fileStorage = (uploadPath) =>
	multer.diskStorage({
		destination(req, file, cb) {
			cb(null, uploadPath);
		},
		filename(req, file, cb) {
			const filename = `FILE_${Date.now()}_${encodeURI(file.originalname)}`;
			cb(null, filename);
		},
	});

export const uploadFile = ({ uploadPath, fieldName }) =>
	multer({
		dest: uploadPath,
		limits: {
			fileSize: 1024 * 1024 * 5, // 5 MB
		},
		storage: fileStorage(uploadPath),
	}).single(fieldName);
