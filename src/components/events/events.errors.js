export const EVENTS_ERROR_CODES = {
	// DAL error codes
	GET_EVENT_LIST_UNHANDLED_IN_DB: 'Something went wrong while getting bot list',
	CREATE_EVENT_UNHANDLED_IN_DB: 'Something went wrong while creating bot in db',
	UPDATE_EVENT_UNHANDLED_IN_DB: 'Something went wrong while updating bot in db',
	DELETE_EVENT_UNHANDLED_IN_DB: 'Something went wrong while deleting bot in db',

	// Controller error codes
	UPDATE_EVENT_BAD_REQUEST:
		'Some important parameter missing in update request',
	DELETE_EVENT_BAD_REQUEST:
		'Some important parameter missing in delete request',
	GET_EVENT_LIST_BAD_REQUEST:
		'Some important parameter missing in fetching request',
	EVENT_NOT_FOUND: 'Event not found',
	UNHANDLED_REQUEST_IN_DB: 'Unhandled request in db',
	EVENT_FULL: 'Event has reached maximum number of attendees',
};
