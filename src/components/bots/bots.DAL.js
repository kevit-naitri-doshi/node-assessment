import HttpException from '../../utils/error.utils.js';
import { BOTS_ERROR_CODES } from './bots.errors.js';
import { Bot } from './bots.model.js';

/**
 * DB helper function for get many bot from query
 * @param {*} query => Bot filter query
 * @returns => array of bot documents
 */
export async function getBotListFromDB(query) {
	try {
		return await Bot.find(query).lean();
	} catch (err) {
		throw new HttpException(
			500,
			BOTS_ERROR_CODES.GET_BOT_LIST_UNHANDLED_IN_DB,
			'GET_BOT_LIST_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper function for create new bot
 * @param {*} botBody => Bot data to create new bot
 * @returns => Document of newly created bot
 */
export async function createSingleBotInDB(botBody) {
	try {
		return await Bot.create(botBody);
	} catch (err) {
		throw new HttpException(
			500,
			BOTS_ERROR_CODES.CREATE_BOT_UNHANDLED_IN_DB,
			'CREATE_BOT_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper to find bot and update it's data
 * @param {string | Schema.Types.ObjectId} botId => Id of which bot need to update
 * @param {*} updateData => Object with fields that need to update
 * @returns => New updated bot document
 */
export async function botFindByIdAndUpdate(botId, updateData) {
	try {
		return await Bot.findByIdAndUpdate(botId, updateData, { new: true }).lean();
	} catch (err) {
		throw new HttpException(
			500,
			BOTS_ERROR_CODES.UPDATE_BOT_UNHANDLED_IN_DB,
			'UPDATE_BOT_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper to delete bot
 * @param {string | Schema.Types.ObjectId} botId => Id of bot that need to be deleted
 * @returns => Bot document that has been deleted
 */
export async function botFindByIdAndDelete(botId) {
	try {
		return await Bot.findByIdAndDelete(botId).lean();
	} catch (err) {
		throw new HttpException(
			500,
			BOTS_ERROR_CODES.DELETE_BOT_UNHANDLED_IN_DB,
			'DELETE_BOT_UNHANDLED_IN_DB',
			err,
		);
	}
}
