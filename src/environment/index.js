import fs from 'fs';
import { validateEnv } from '../utils/validateEnv.js';

const env = validateEnv;

// JWT PRIVATE and PUBLIC key for Auth token
const jwtPrivateKey = fs.readFileSync('./src/keys/jwtPrivate.key', 'utf8'); // readFileSync will read path from project's root (process.cwd())
const jwtPublicKey = fs.readFileSync('./src/keys/jwtPublic.key', 'utf8');

const environment = {
	/* GENERAL */
	BASE_URL: env.BASE_URL,
	NODE_ENV: env.NODE_ENV,
	APP_PORT: env.APP_PORT,
	/* DATABASE */
	MONGODB_URL: env.MONGODB_URL,
	/* AUTHORIZATION */
	JWT_PRIVATE_KEY: jwtPrivateKey,
	JWT_PUBLIC_KEY: jwtPublicKey,
	/* DEBUG_CONFIG */
	DEBUG_MODE: env.DEBUG_MODE,
};

export default environment;
