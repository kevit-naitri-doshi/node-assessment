import { pinoFormateConfig as logger } from '../../services/logger.js';
import HttpException from '../../utils/error.utils.js';
import { EVENTS_ERROR_CODES } from './events.errors.js';
import { Event, registeredEvents } from './events.model.js';

/**
 * DB helper function for get many bot from query
 *
 * @returns => array of bot documents
 */
export async function getEventListFromDB(query = {}) {
	logger.info('EventsDAL: getEventListFromDB');
	try {
		return await Event.find(query).lean();
	} catch (err) {
		logger.error({ err }, 'EventsDAL: getEventListFromDB failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.GET_EVENT_LIST_UNHANDLED_IN_DB,
			'GET_EVENT_LIST_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper function for create new bot
 * @param {*} eventBody => Bot data to create new bot
 * @returns => Document of newly created bot
 */
export async function createSingleEventInDB(eventBody) {
	logger.info('EventsDAL: createSingleEventInDB');
	try {
		return await Event.create(eventBody);
	} catch (err) {
		logger.error({ err }, 'EventsDAL: createSingleEventInDB failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.CREATE_EVENT_UNHANDLED_IN_DB,
			'CREATE_EVENT_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper to find bot and update it's data
 * @param {string | Schema.Types.ObjectId} eventId => Id of which bot need to update
 * @param {*} updateData => Object with fields that need to update
 * @returns => New updated bot document
 */
export async function eventFindByIdAndUpdate(eventId, updateData) {
	logger.info('EventsDAL: eventFindByIdAndUpdate');
	try {
		return await Event.findByIdAndUpdate(eventId, updateData, {
			new: true,
		}).lean();
	} catch (err) {
		logger.error({ err }, 'EventsDAL: eventFindByIdAndUpdate failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.UPDATE_EVENT_UNHANDLED_IN_DB,
			'UPDATE_EVENT_UNHANDLED_IN_DB',
			err,
		);
	}
}

/**
 * DB helper to delete bot
 * @param {string | Schema.Types.ObjectId} eventId => Id of bot that need to be deleted
 * @returns => Bot document that has been deleted
 */
export async function eventFindByIdAndDelete(eventId) {
	logger.info('EventsDAL: eventFindByIdAndDelete');
	try {
		return await Event.findByIdAndDelete(eventId).lean();
	} catch (err) {
		logger.error({ err }, 'EventsDAL: eventFindByIdAndDelete failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.DELETE_EVENT_UNHANDLED_IN_DB,
			'DELETE_EVENT_UNHANDLED_IN_DB',
			err,
		);
	}
}

export async function registerForEvent(userId, eventId) {
	logger.info('EventsDAL: registerForEvent');
	try {
		return await registeredEvents.create({ userId, eventId });
	} catch (err) {
		logger.error({ err }, 'EventsDAL: registerForEvent failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
			'UNHANDLED_REQUEST_IN_DB',
			err,
		);
	}
}

export async function unregisterFromEvent(userId, eventId) {
	logger.info('EventsDAL: unregisterFromEvent');
	try {
		return await registeredEvents.deleteOne({ userId, eventId });
	} catch (err) {
		logger.error({ err }, 'EventsDAL: unregisterFromEvent failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
			'UNHANDLED_REQUEST_IN_DB',
			err,
		);
	}
}

export async function getRegisteredEvents(eventId) {
	logger.info('EventsDAL: getRegisteredEvents');
	try {
		return await registeredEvents.find({ eventId: eventId }).countDocuments();
	} catch (err) {
		logger.error({ err }, 'EventsDAL: getRegisteredEvents failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
			'UNHANDLED_REQUEST_IN_DB',
			err,
		);
	}
}

export async function getEventAnalytics() {
	logger.info('EventsDAL: getEventAnalytics');
	try {
		const pipeline = [
			{
				$match: {
					createdAt: {
						$gte: new Date(new Date().getFullYear(), 0, 1), // Jan 1st this year
						$lt: new Date(new Date().getFullYear() + 1, 0, 1), // Jan 1st next year
					},
				},
			},
			{
				$group: {
					_id: { month: { $month: '$createdAt' } },
					totalEvents: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					month: '$_id.month',
					totalEvents: 1,
				},
			},
			{
				$sort: { '_id.month': 1 },
			},
		];

		const totalEvents = await Event.aggregate(pipeline);

		const topEvents = await registeredEvents.aggregate([
			{
				$group: {
					_id: '$eventId', // group by eventId field
					totalUsers: { $sum: 1 },
				},
			},
			{ $sort: { totalUsers: -1 } }, // separate stage
			{ $limit: 3 },
		]);

		logger.info('EventsDAL: getEventAnalytics success');
		return { totalEvents, topEvents };
	} catch (err) {
		logger.error({ err }, 'EventsDAL: getEventAnalytics failed');
		throw new HttpException(
			500,
			EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
			'UNHANDLED_REQUEST_IN_DB',
			err,
		);
	}
}
