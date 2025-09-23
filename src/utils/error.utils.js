function getErrorFromCode(statusCode) {
	switch (statusCode) {
		case 500: {
			return 'DATABASE_ERROR';
		}
		case 400: {
			return 'BAD_REQUEST';
		}
		case 401: {
			return 'UNAUTHORIZED';
		}
		case 424: {
			return 'FAILED_DEPENDENCY';
		}
		case 404: {
			return 'NOT_FOUND';
		}
		case 409: {
			return 'CONFLICT';
		}
		case 403: {
			return 'FORBIDDEN';
		}
		default:
			return 'UNHANDLED_ERROR';
	}
}

export default class HttpException extends Error {
	constructor(statusCode, message, errorCode, err, meta) {
		super(message);
		this.statusCode = statusCode;
		this.error = getErrorFromCode(statusCode);
		this.errorCode = errorCode;
		this.message = message;
		this.originalError = err;
		this.meta = meta;
	}
}
