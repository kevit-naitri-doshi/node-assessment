import { Router } from 'express';
import { authenticateMiddleware } from '../../middleware/authentication.middleware.js';
import { validateRequestMiddleware } from '../../middleware/error.middleware.js';
import BotsController from './bots.controller.js';
import { createNewBotSchema } from './bots.model.js';

class BotsRoute {
	path = '/bots';

	router = Router();

	botController = new BotsController();

	constructor() {
		this.initializeRoutes();
	}

	initializeRoutes() {
		this.router.get(
			this.path,
			authenticateMiddleware.authorize,
			this.botController.getBotslist,
		);
		this.router.post(
			this.path,
			authenticateMiddleware.authorize,
			validateRequestMiddleware(createNewBotSchema),
			this.botController.createNewBot,
		);
		this.router.put(
			`${this.path}/:botId`,
			authenticateMiddleware.authorize,
			validateRequestMiddleware(createNewBotSchema),
			this.botController.updateExistingBot,
		);
		this.router.delete(
			`${this.path}/:botId`,
			authenticateMiddleware.authorize,
			this.botController.deleteExistingBot,
		);
	}
}

export default BotsRoute;
