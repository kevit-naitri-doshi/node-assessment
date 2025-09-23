import { pinoFormateConfig as logger } from '../../services/logger.js';
import HttpException from '../../utils/error.utils.js';
import {
	createSingleEventInDB,
	eventFindByIdAndDelete,
	eventFindByIdAndUpdate,
	getEventAnalytics as getEventAnalyticsDAL,
	getEventListFromDB,
	getRegisteredEvents,
	registerForEvent,
	unregisterFromEvent,
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
			const { location, date } = req.query;
			let query = {};
			if (location) {
				query.eventLocation = location;
			}
			if (date) {
				query.eventDate = date;
			}
			const events = await getEventListFromDB(query);
			logger.info('EventsController: getEventsList success');
			return res.status(200).json(events);
		} catch (err) {
			logger.error({ err }, 'EventsController: getEventsList failed');
			return next(err);
		}
	}

	async getEventById(req, res, next) {
		logger.info('EventsController: getEventById');
		try {
			const { eventId } = req.params;
			const event = await getEventListFromDB({ _id: eventId });
			if (!event) {
				throw new HttpException(
					404,
					EVENTS_ERROR_CODES.EVENT_NOT_FOUND,
					'EVENT_NOT_FOUND',
					null,
				);
			}
			logger.info('EventsController: getEventById success');
			return res.status(200).json(event);
		} catch (err) {
			logger.error({ err }, 'EventsController: getEventById failed');
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
			const {
				eventName,
				eventDate,
				eventLocation,
				eventDescription,
				maxAttendees,
			} = req.body;
			const newEventData = {
				eventName,
				eventDate,
				eventLocation,
				eventDescription,
				maxAttendees,
				createdBy: req.user._id,
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
					404,
					EVENTS_ERROR_CODES.EVENT_NOT_FOUND,
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

	async registerForEvent(req, res, next) {
		logger.info('EventsController: registerForEvent');
		try {
			const { eventId } = req.params;
			const userId = req.user._id;

			// Fetch event from DB
			let event = await getEventListFromDB({ _id: eventId });
			logger.info({ event }, 'Fetched event details');
			if (!event) {
				throw new HttpException(
					404,
					EVENTS_ERROR_CODES.EVENT_NOT_FOUND,
					'EVENT_NOT_FOUND',
					null,
				);
			}

			event = event[0]; // As find returns array of documents

			const totalRegistrations = await getRegisteredEvents(eventId);
			logger.info(
				`Total registrations for event ${eventId}: ${totalRegistrations}`,
			);
			logger.info(`Max attendees for event ${eventId}: ${event.maxAttendees}`);
			if (totalRegistrations >= event.maxAttendees) {
				throw new HttpException(
					400,
					EVENTS_ERROR_CODES.EVENT_FULL,
					'EVENT_FULL',
					null,
				);
			}

			const registeredEvent = await registerForEvent(userId, eventId);
			if (!registeredEvent) {
				throw new HttpException(
					500,
					EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
					'UNHANDLED_REQUEST_IN_DB',
					null,
				);
			}

			logger.info('EventsController: registerForEvent success');
			return res
				.status(200)
				.json({ message: 'Registered for event successfully' });
		} catch (err) {
			logger.error({ err }, 'EventsController: registerForEvent failed');
			return next(err);
		}
	}

	async unregisterFromEvent(req, res, next) {
		logger.info('EventsController: unregisterFromEvent');
		try {
			const { eventId } = req.params;
			const userId = req.user._id;

			// Fetch event from DB
			const event = await getEventListFromDB({ _id: eventId });
			if (!event) {
				throw new HttpException(
					404,
					EVENTS_ERROR_CODES.EVENT_NOT_FOUND,
					'EVENT_NOT_FOUND',
					null,
				);
			}
			const unregisterEvent = await unregisterFromEvent(userId, eventId);
			if (!unregisterEvent) {
				throw new HttpException(
					500,
					EVENTS_ERROR_CODES.UNHANDLED_REQUEST_IN_DB,
					'UNHANDLED_REQUEST_IN_DB',
					null,
				);
			}
			logger.info('EventsController: unregisterFromEvent success');
			return res
				.status(200)
				.json({ message: 'Unregistered from event successfully' });
		} catch (err) {
			logger.error({ err }, 'EventsController: unregisterFromEvent failed');
			return next(err);
		}
	}

	async getEventAnalytics(req, res, next) {
		logger.info('EventsController: getEventAnalytics');
		try {
			const { totalEvents, topEvents } = await getEventAnalyticsDAL();

			logger.info('EventsController: getEventAnalytics success');
			return res.status(200).json({
				totalEvents,
				topEvents,
				message: 'Analytics fetched successfully',
			});
		} catch (err) {
			logger.error({ err }, 'EventsController: getEventAnalytics failed');
			return next(err);
		}
	}
}

export default EventsController;
