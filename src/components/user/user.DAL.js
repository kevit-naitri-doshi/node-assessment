import HttpException from '../../utils/error.utils.js';
import { USER_ERROR_CODES } from './user.errors.js';
import { User } from './user.model.js';

export async function createNewUser(userBody) {
	try {
		return await User.create(userBody);
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.CREATE_USER_UNHANDLED_IN_DB,
			'CREATE_USER_UNHANDLED_IN_DB',
			err,
		);
	}
}

export async function findUserById(userId) {
	try {
		return await User.findById(userId).lean();
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			err,
		);
	}
}

export async function userFindByIdAndUpdate(userId, updateObj) {
	try {
		return await User.findByIdAndUpdate(userId, updateObj, {
			new: true,
		}).lean();
	} catch (err) {
		throw new HttpException(
			500,
			USER_ERROR_CODES.UPDATE_USER_UNHANDLED_IN_DB,
			'UPDATE_USER_UNHANDLED_IN_DB',
			err,
		);
	}
}
