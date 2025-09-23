import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// ====================================================================================
// Bot request scheam for validation
// ====================================================================================

/**
 * createNewBot
 * @method POST
 * @path /bots
 */
export const createNewEventSchema = {
	eventName: {
		isString: true,
		errorMessage: 'Enter valid event name',
	},
	eventDate: {
		isISO8601: true,
		errorMessage: 'Enter valid event date',
	},
	eventLocation: {
		isString: true,
		errorMessage: 'Enter valid event location',
	},
	eventDescription: {
		isString: true,
		errorMessage: 'Enter valid event description',
	},
	maxAttendees: {
		isInt: true,
		errorMessage: 'Enter valid max attendees',
	},
};

export const updateEventSchema = {
	eventName: {
		isString: true,
		errorMessage: 'Enter valid event name',
		optional: true,
	},
	eventDate: {
		isISO8601: true,
		errorMessage: 'Enter valid event date',
		optional: true,
	},
	eventLocation: {
		isString: true,
		errorMessage: 'Enter valid event location',
		optional: true,
	},
	eventDescription: {
		isString: true,
		errorMessage: 'Enter valid event description',
		optional: true,
	},
	maxAttendees: {
		isInt: true,
		errorMessage: 'Enter valid max attendees',
		optional: true,
	},
};

// Bot Schema
const EventSchema = new Schema(
	{
		eventName: {
			type: Schema.Types.String,
			required: true,
		},
		eventDate: {
			type: Schema.Types.Date,
			required: true,
		},
		eventLocation: {
			type: Schema.Types.String,
			required: true,
		},
		eventDescription: {
			type: Schema.Types.String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		maxAttendees: {
			type: Schema.Types.Number,
			default: 100,
		},
	},
	{
		timestamps: true,
	},
);

const registeredEventSchema = new Schema(
	{
		eventId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		userId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const Event = model('event', EventSchema);
export const registeredEvents = model(
	'registered_event',
	registeredEventSchema,
);
