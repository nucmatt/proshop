import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
	// cb is for callback function, null means no error?
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename(req, file, cb) {
		// path is a Node.js module, .extname is a method in the path module that gets the extension name of a file that is passed to it. So here we are getting the name of the file uploaded via file.fieldname, adding the current date, and then adding the original file's extension to the create a fully unique uploaded file name for each uploaded image.
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

function checkFileType(file, cb) {
	const filetypes = /jpg|jpeg|png/;
	const extname = filetypes.test(path.extname(file.originalname.toLowerCase()));
	const mimetype = filetypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb('Images only!');
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	res.send(`/${req.file.path}`);
});

export default router;
