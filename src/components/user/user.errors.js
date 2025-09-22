export const USER_ERROR_CODES = {
	// User Controller error codes
	BAD_REQUEST_GET_USERS: 'Imported parameter missing from request',
	SIGN_IN_BAD_REQUEST: 'Imported parameter missing in sign In request',
	SIGN_IN_FAIL: 'Provided cred are not correct',
	USER_NOT_FOUND: 'User not found for email id',
	INCORRECT_PASSWORD: 'Password incorrect',
	USER_SESSION_EXPIRED: 'User login timeout',
	AUTH_FAILED: 'Auth failed',
	BAD_REQUEST_FOR_UPLOAD_PROFILE_PHOTO:
		'Some imported parameter missing in upload request',
	UPLOAD_PROFILE_IMAGE_FAILED:
		'Something went wrong while update profile picture',

	// User DAL error codes
	CREATE_USER_UNHANDLED_IN_DB: 'Something went wrong while creating new user',
};
