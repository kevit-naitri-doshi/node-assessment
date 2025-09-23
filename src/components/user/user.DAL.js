import { pinoFormateConfig as logger } from '../../services/logger.js';
import HttpException from '../../utils/error.utils.js';
import { USER_ERROR_CODES } from './user.errors.js';
import { User } from './user.model.js';

export async function createNewUser(userBody) {
	logger.info('UserDAL: createNewUser');
	try {
		return await User.create(userBody);
	} catch (err) {
		logger.error(err.message, 'UserDAL: createNewUser failed');
		if (
			err?.code === 11000 &&
			(err?.keyPattern?.emailId || err?.keyValue?.emailId)
		) {
			throw new HttpException(
				409,
				USER_ERROR_CODES.USER_ALREADY_EXISTS,
				'USER_ALREADY_EXISTS',
				{ field: 'emailId', value: err?.keyValue?.emailId },
			);
		}
	}
}

export async function findUserById(userId) {
	logger.info('UserDAL: findUserById');
	try {
		return await User.findById(userId).lean();
	} catch (err) {
		logger.error({ err }, 'UserDAL: findUserById failed');
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}

export async function userFindByIdAndUpdate(userId, updateObj) {
	logger.info('UserDAL: userFindByIdAndUpdate');
	try {
		return await User.findByIdAndUpdate(userId, updateObj, {
			new: true,
		}).lean();
	} catch (err) {
		logger.error({ err }, 'UserDAL: userFindByIdAndUpdate failed');
		throw new HttpException(
			500,
			USER_ERROR_CODES.UPDATE_USER_UNHANDLED_IN_DB,
			'UPDATE_USER_UNHANDLED_IN_DB',
			err,
		);
	}
}
