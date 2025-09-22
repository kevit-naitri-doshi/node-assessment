import pino from 'pino';
import PinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import Config from '../environment/index.js';

// formate logs for env
export const pinoFormateConfig = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
			ignore: 'pid,hostname',
			colorize: true,
		},
	},
});

const debugConfig = {
	res(reply) {
		if (!Config.DEBUG_MODE) {
			return;
		}

		return reply;
	},
	req(request) {
		if (!Config.DEBUG_MODE) {
			return;
		}

		return request;
	},
};

export const customLogger = {
	development: PinoHttp({
		redact: ['HTTP_Request.headers'],
		logger: pinoFormateConfig,
		level: 'trace',
		genReqId() {
			return uuidv4();
		},
		customLogLevel(res, err) {
			if (err) {
				return 'error';
			}
			if (res && res.statusCode === 500) {
				return 'fatal';
			}
			if (res.statusCode >= 400 && res.statusCode < 500) {
				return 'error';
			}
			return 'info';
		},
		customSuccessMessage(res) {
			return `Request completed with statusCode ${res.statusCode}`;
		},
		customErrorMessage(error) {
			return error.message;
		},
		customAttributeKeys: {
			req: 'HTTP_Request',
			res: 'HTTP_Response',
			err: 'HTTP_Error',
			responseTime: 'Execute_Time',
		},
		serializers: debugConfig,
	}),
	production: PinoHttp({
		redact: ['req.headers'],
		logger: pino(),
		levelFirst: true,
		serializers: {
			res(reply) {
				if (!Config.DEBUG_MODE) {
					return;
				}

				return {
					statusCode: reply.statusCode,
				};
			},
			req(request) {
				if (!Config.DEBUG_MODE) {
					return;
				}

				return {
					id: uuidv4(),
					method: request.method,
					url: request.url,
					path: request.path,
					parameters: request.parameters,
					// Including the headers in the log could be in violation
					// of privacy laws, e.g. GDPR. You should use the "redact" option to
					// remove sensitive fields. It could also leak authentication data in
					// the logs.
					headers: request.headers,
					hostname: request.hostname,
					remoteAddress: request.ip,
				};
			},
		},
	}),
};
