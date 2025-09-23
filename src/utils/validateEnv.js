import 'dotenv/config.js';
import { bool, cleanEnv, port, str } from 'envalid';

// eslint-disable-next-line no-undef
export const validateEnv = cleanEnv(process.env, {
	BASE_URL: str({
		default: 'http://localhost:3500',
	}),
	NODE_ENV: str({
		devDefault: 'development',
		default: 'production',
		choices: ['test', 'development', 'production'],
		desc: 'Current Environment',
	}),
	APP_PORT: port(),
	MONGODB_URL: str({
		devDefault: 'mongodb://localhost:27017/node-assessment',
		default: 'mongodb://localhost:27017/node-assessment',
	}),
	DEBUG_MODE: bool({ default: false }),
});
