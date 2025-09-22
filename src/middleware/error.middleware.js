import { checkSchema, validationResult } from 'express-validator';
import HttpException from '../utils/error.utils.js';

export function validateRequestMiddleware(schema) {
	return async (req, res, next) => {
		await checkSchema(schema).run(req);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			next(
				new HttpException(
					400,
					'Middleware validation fail',
					'MIDDLWARE_VALIDATION_ERROR',
					null,
					{
						...errors,
					},
				),
			);
		}
		next();
	};
}
