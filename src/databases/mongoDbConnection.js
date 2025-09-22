import Config from '../environment/index.js';

/**
 * Give different map as per env exists in project
 */
export const dbConnection = {
	url: Config.MONGODB_URL,
};
