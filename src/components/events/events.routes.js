import { Router } from 'express';
import { authenticateMiddleware } from '../../middleware/authentication.middleware.js';
import { validateRequestMiddleware } from '../../middleware/error.middleware.js';
import EventsController from './events.controller.js';
import { createNewEventSchema, updateEventSchema } from './events.model.js';
import UserRoles from '../../utils/roles.js';

class EventsRoute {
	path = '/events';

	router = Router();

	eventController = new EventsController();

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.get(
			this.path,
			authenticateMiddleware.authorize([UserRoles.USER, UserRoles.ADMIN]),
			this.eventController.getEventsList,
		);
		this.router.post(
			this.path,
			authenticateMiddleware.authorize([UserRoles.ADMIN]),
			validateRequestMiddleware(createNewEventSchema),
			this.eventController.createNewEvent,
		);
		this.router.put(
			`${this.path}/:eventId`,
			authenticateMiddleware.authorize([UserRoles.ADMIN]),
			validateRequestMiddleware(updateEventSchema),
			this.eventController.updateExistingEvent,
		);
		this.router.delete(
			`${this.path}/:eventId`,
			authenticateMiddleware.authorize([UserRoles.ADMIN]),
			this.eventController.deleteExistingEvent,
		);
	}
}

export default EventsRoute;
