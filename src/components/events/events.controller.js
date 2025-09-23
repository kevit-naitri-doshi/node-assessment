import { pinoFormateConfig as logger } from '../../services/logger.js';
import HttpException from '../../utils/error.utils.js';
import {
	createSingleEventInDB,
	eventFindByIdAndDelete,
	eventFindByIdAndUpdate,
	getEventListFromDB,
} from './events.DAL.js';
import { EVENTS_ERROR_CODES } from './events.errors.js';

class EventsController {
	/**
	 * Find bot for sign in user
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async getEventsList(req, res, next) {
		logger.info('EventsController: getEventsList');
		try {
			const events = await getEventListFromDB();
			logger.info('EventsController: getEventsList success');
			return res.status(200).json(events);
		} catch (err) {
			logger.error({ err }, 'EventsController: getEventsList failed');
			return next(err);
		}
	}

	/**
	 * Create new bot with given body
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async createNewEvent(req, res, next) {
		logger.info('EventsController: createNewEvent');
		try {
			const { eventName, eventDate, eventLocation, eventDescription } =
				req.body;
			const newEventData = {
				eventName,
				eventDate,
				eventLocation,
				eventDescription,
				userId: req.user._id,
			};
			const newEvent = await createSingleEventInDB(newEventData);
			logger.info('EventsController: createNewEvent success');
			return res
				.status(200)
				.json({ _id: newEvent._id, message: 'Event created successfully' });
		} catch (err) {
			logger.error({ err }, 'EventsController: createNewEvent failed');
			return next(err);
		}
	}

	/**
	 * Update paritcular bot with given id
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async updateExistingEvent(req, res, next) {
		logger.info('EventsController: updateExistingEvent');
		try {
			const { eventId } = req.params;
			const eventUpdateInfo = req.body;
			if (!eventId) {
				/**
				 * SUGGESTION: while throwing custom error we don't have proper info why error occured,
				 *             So for debug we can pass meta object where we can pass any details that
				 *             you find useful in debugging.
				 *  */
				throw new HttpException(
					400,
					EVENTS_ERROR_CODES.UPDATE_EVENT_BAD_REQUEST,
					'UPDATE_EVENT_BAD_REQUEST',
					null,
					{
						externalErrorInfo: 'Event Id missing in request',
					},
				);
			}

			const updateEventData = await eventFindByIdAndUpdate(
				eventId,
				eventUpdateInfo,
			);

			logger.info('EventsController: updateExistingEvent success');
			return res.status(200).json({
				_id: updateEventData._id,
				message: 'Event updated successfully',
			});
		} catch (err) {
			logger.error({ err }, 'EventsController: updateExistingEvent failed');
			return next(err);
		}
	}

	/**
	 * Delete bot with given id
	 * @param {Request} req => Express request
	 * @param {Response} res => Express response
	 */
	async deleteExistingEvent(req, res, next) {
		logger.info('EventsController: deleteExistingEvent');
		try {
			const { eventId } = req.params;
			const deletedEvent = await eventFindByIdAndDelete(eventId);
			if (!deletedEvent) {
				throw new HttpException(
					400,
					EVENTS_ERROR_CODES.EVENT_NOT_FOUND_FOR_DELETE,
					'EVENT_NOT_FOUND_FOR_DELETE',
					null,
				);
			}
			logger.info('EventsController: deleteExistingEvent success');
			return res
				.status(200)
				.json({ ...deletedEvent, message: 'Event deleted successfully' });
		} catch (err) {
			logger.error({ err }, 'EventsController: deleteExistingEvent failed');
			return next(err);
		}
	}
}

export default EventsController;
