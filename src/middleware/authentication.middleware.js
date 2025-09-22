import { USER_ERROR_CODES } from '../components/user/user.errors.js';
import { User } from '../components/user/user.model.js';
import HttpException from '../utils/error.utils.js';

const AUTH_ERROR_CODES = {
	HEADERS_NOT_SET_IN_REQUEST: 'Request not contain auth token',
};

class Authenticate {
	authorize(req, res, next) {
		const token = req.header('authorization');
		if (token) {
			User.findByToken(token).then((user) => {
				if (user) {
					req.user = user;
					next();
				} else {
					throw new HttpException(
						404,
						USER_ERROR_CODES.USER_NOT_FOUND,
						'USER_NOT_FOUND',
						null,
					);
				}
			});
		} else {
			throw new HttpException(
				400,
				AUTH_ERROR_CODES.HEADERS_NOT_SET_IN_REQUEST,
				'HEADERS_NOT_SET_IN_REQUEST',
				null,
			);
		}
	}
}

export const authenticateMiddleware = new Authenticate();
