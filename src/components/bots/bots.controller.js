import HttpException from '../../utils/error.utils.js';
import {
	botFindByIdAndDelete,
	botFindByIdAndUpdate,
	createSingleBotInDB,
	getBotListFromDB,
} from './bots.DAL.js';
import { BOTS_ERROR_CODES } from './bots.errors.js';

class BotsController {
	/**
	 * Find bot for sign in user
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async getBotslist(req, res, next) {
		try {
			const userId = req.user._id;
			if (!userId) {
				throw new HttpException(
					400,
					BOTS_ERROR_CODES.GET_BOT_LIST_BAD_REQUEST,
					'GET_BOT_LIST_BAD_REQUEST',
					null,
					{
						externalErrorInfo: 'User Id missing in request',
					},
				);
			}

			const bots = await getBotListFromDB({
				userId,
			});
			return res.status(200).json(bots);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create new bot with given body
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async createNewBot(req, res, next) {
		try {
			const { botName, availablePlatform, botEndpoint = undefined } = req.body;
			const newBotData = {
				botName,
				availablePlatform,
				botEndpoint,
				userId: req.user._id,
			};
			const newBot = await createSingleBotInDB(newBotData);
			return res.status(200).json({ _id: newBot._id });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update paritcular bot with given id
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async updateExistingBot(req, res, next) {
		try {
			const { botId } = req.params;
			const botUpdateInfo = req.body;
			if (!botId) {
				/**
				 * SUGGESTION: while throwing custom error we don't have proper info why error occured,
				 *             So for debug we can pass meta object where we can pass any details that
				 *             you find useful in debugging.
				 *  */
				throw new HttpException(
					400,
					BOTS_ERROR_CODES.UPDATE_BOT_BAD_REQUEST,
					'UPDATE_BOT_BAD_REQUEST',
					null,
					{
						externalErrorInfo: 'Bot Id missing in request',
					},
				);
			}

			const updateBotData = await botFindByIdAndUpdate(botId, botUpdateInfo);

			return res.status(200).json({
				_id: updateBotData._id,
			});
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete bot with given id
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async deleteExistingBot(req, res, next) {
		try {
			const { botId } = req.params;
			const deletedBot = await botFindByIdAndDelete(botId);
			if (!deletedBot) {
				throw new HttpException(
					400,
					BOTS_ERROR_CODES.BOT_NOT_FOUND_FOR_DELETE,
					'BOT_NOT_FOUND_FOR_DELETE',
					null,
				);
			}
			return res.status(200).json(deletedBot);
		} catch (err) {
			return next(err);
		}
	}
}

export default BotsController;
