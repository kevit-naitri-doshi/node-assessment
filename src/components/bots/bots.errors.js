export const BOTS_ERROR_CODES = {
	// DAL error codes
	GET_BOT_LIST_UNHANDLED_IN_DB: 'Something went wrong while getting bot list',
	CREATE_BOT_UNHANDLED_IN_DB: 'Something went wrong while creating bot in db',
	UPDATE_BOT_UNHANDLED_IN_DB: 'Something went wrong while updating bot in db',
	DELETE_BOT_UNHANDLED_IN_DB: 'Something went wrong while deleting bot in db',

	// Controller error codes
	UPDATE_BOT_BAD_REQUEST: 'Some important parameter missing in update request',
	DELETE_BOT_BAD_REQUEST: 'Some important parameter missing in delete request',
	GET_BOT_LIST_BAD_REQUEST:
		'Some important parameter missing in fetching request',
	BOT_NOT_FOUND_FOR_DELETE: 'Bot not found',
};
