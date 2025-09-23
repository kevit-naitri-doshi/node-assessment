import { pinoFormateConfig as logger } from '../../services/logger.js';
import HttpException from '../../utils/error.utils.js';
import UserRoles from '../../utils/roles.js';
import { createNewUser, findUserById } from './user.DAL.js';
import { USER_ERROR_CODES } from './user.errors.js';
import { User } from './user.model.js';

class UsersController {
	/**
	 * Sign up new user and send mail to them
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async signUpUser(req, res, next) {
		logger.info('UsersController: signUpUser');
		try {
			// Getting data from body and creating new user
			const {
				firstName,
				lastName,
				emailId,
				planType,
				mobileNo,
				password,
				role,
			} = req.body;
			const userObject = {
				firstName,
				lastName,
				emailId,
				planType,
				mobileNo,
				password,
				role: role || UserRoles.USER,
			};
			const user = await createNewUser(userObject);

			logger.info('UsersController: signUpUser success');
			return res
				.status(200)
				.json({ userId: user._id, message: 'User created successfully' });
		} catch (err) {
			logger.error({ err }, 'UsersController: signUpUser failed');
			return next(err);
		}
	}

	/**
	 * Sign in user with credentials
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Response
	 * @param {NextFunction} next => Express next function
	 */
	async signInUser(req, res, next) {
		logger.info('UsersController: signInUser');
		try {
			// Validating body data
			const { email, password } = req.body;
			if (!email || !password) {
				throw new HttpException(
					400,
					USER_ERROR_CODES.SIGN_IN_BAD_REQUEST,
					'SIGN_IN_BAD_REQUEST',
					null,
				);
			}

			// Finding user and validating data
			const userData = await User.findByCredentials(email, password);
			if (!userData) {
				throw new HttpException(
					404,
					USER_ERROR_CODES.SIGN_IN_FAIL,
					'SIGN_IN_FAIL',
					null,
				);
			}

			const userToken = await userData.getAuthToken();
			logger.info('UsersController: signInUser success');
			return res.status(200).json({
				message: 'User logged in successfully',
				accessToken: userToken,
				userId: userData._id,
				userName: userData.firstName,
				email: userData.emailId,
			});
		} catch (err) {
			logger.error({ err }, 'UsersController: signInUser failed');
			return next(err);
		}
	}

	/**
	 * Get user profile of logged in user
	 * @param {Request} req => Express Request
	 * @param {Response} res => Express Repponse
	 * @param {NextFunction} next => Express next function
	 */
	async getUsers(req, res, next) {
		logger.info('UsersController: getUsers');
		try {
			// Get user data of logIn user
			const userId = req.user._id;
			const user = await findUserById(userId);

			logger.info('UsersController: getUsers success');
			return res.status(200).json(user);
		} catch (err) {
			logger.error({ err }, 'UsersController: getUsers failed');
			return next(err);
		}
	}
}

export default UsersController;
