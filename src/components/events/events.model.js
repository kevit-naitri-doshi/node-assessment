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
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

export const Event = model('event', EventSchema);
export default Event;
