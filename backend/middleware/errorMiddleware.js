const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

const errorHandler = (err, req, res, next) => {
	// Sometimes an error can be thrown but to response code is still 200. If that happens this code will change the code to a 500.
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	res.status(statusCode);

	res.json({
		message: err.message,
		// error stack should only be displayed in a development environment.
		stack: process.env.NODE_ENV === 'production' ? null : err.stack,
	});
};

export { notFound, errorHandler };
