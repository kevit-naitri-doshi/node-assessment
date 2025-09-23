import { USER_ERROR_CODES } from '../components/user/user.errors.js';
import { User } from '../components/user/user.model.js';
import HttpException from '../utils/error.utils.js';
import UserRoles from '../utils/roles.js';

const AUTH_ERROR_CODES = {
	HEADERS_NOT_SET_IN_REQUEST: 'Request not contain auth token',
	UNAUTHORIZED_ROLE: 'User does not have the required role',
};

class Authenticate {
	authorize(requiredRoles = [UserRoles.USER]) {
		return (req, res, next) => {
			const token = req.header('authorization');
			if (token) {
				User.findByToken(token.split(' ')[1])
					.then((user) => {
						if (user) {
							req.user = user;

							// Check if the user's role matches one of the required roles
							if (
								requiredRoles.length > 0 &&
								!requiredRoles.includes(user.role)
							) {
								throw new HttpException(
									403,
									AUTH_ERROR_CODES.UNAUTHORIZED_ROLE,
									'UNAUTHORIZED_ROLE',
									null,
								);
							}

							next();
						} else {
							throw new HttpException(
								404,
								USER_ERROR_CODES.USER_NOT_FOUND,
								'USER_NOT_FOUND',
								null,
							);
						}
					})
					.catch((err) => next(err));
			} else {
				throw new HttpException(
					400,
					AUTH_ERROR_CODES.HEADERS_NOT_SET_IN_REQUEST,
					'HEADERS_NOT_SET_IN_REQUEST',
					null,
				);
			}
		};
	}
}

export const authenticateMiddleware = new Authenticate();
