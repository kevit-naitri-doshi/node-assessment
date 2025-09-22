import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import { dbConnection } from './databases/mongoDbConnection.js';
import Config from './environment/index.js';

import { pinoFormateConfig } from './services/logger.js';

const BODY_PAYLOAD_LIMIT = 100 * 100000; // 1 MB

class App {
	// Intializing app configs
	constructor(routes) {
		this.app = express();
		this.logger = pinoFormateConfig;
		this.port = Config.APP_PORT;
		this.env = Config.NODE_ENV;

		this.databaseConnection();
		this.initializeMiddlewares();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	// Class Methods
	listen() {
		this.app.listen(this.port, () => {
			this.logger.info(`=================================`);
			this.logger.info(`======= ENV: ${this.env} =======`);
			this.logger.info(`🚀 App listening on the port ${this.port}`);
			this.logger.info(`=================================`);
		});
	}

	databaseConnection() {
		mongoose.connection.on('connected', () => {
			this.logger.info('🔥 DATABASE - Connected');
		});

		mongoose.connection.on('error', (err) => {
			this.logger.error(`DATABASE - Error:${err}`);
		});

		mongoose.connect(dbConnection.url);
	}

	initializeRoutes(routes) {
		routes.forEach((route) => {
			this.app.use('/', route.router);
		});
	}

	initializeMiddlewares() {
		this.app.use(helmet());
		this.app.use(express.json({ limit: BODY_PAYLOAD_LIMIT }));
		this.app.use(
			express.urlencoded({ extended: false, limit: BODY_PAYLOAD_LIMIT }),
		);
		this.app.use(
			cors({
				origin: true,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
				allowedHeaders: [
					'Origin',
					' X-Requested-With',
					' Content-Type',
					' Accept ',
					' Authorization',
					'x-ms-bot-agent',
					'User-Agent',
				],
				credentials: true,
			}),
		);

		// To compress all response of request, to customize it add condition here or in function.
		this.app.use(compression());

		// Use this if you want to do some logic on cookies
		this.app.use(cookieParser());

		// Use this to get polluted query parameters
		this.app.use(hpp());
	}

	initializeErrorHandling() {
		/**
		 * Catch 404 routes
		 */
		this.app.use((req, res, next) => {
			const err = new Error('Invalid route');
			err.status = 404;
			err.message = 'Invalid route';
			next(err);
		});

		// /**
		//  * Error Handler
		//  */
		this.app.use((err, req, res, next) => {
			res.status(err.statusCode || 500);
			res.json(err);
			next(err);
		});
	}
}

export default App;
