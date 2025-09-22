import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const botPlatforms = ['webchat', 'facebook', 'whatsapp'];

// ====================================================================================
// Bot request scheam for validation
// ====================================================================================

/**
 * createNewBot
 * @method POST
 * @path /bots
 */
export const createNewBotSchema = {
	botName: {
		isString: true,
		isLength: {
			options: {
				min: 5,
			},
		},
		errorMessage: 'Enter valid bot name',
	},
	availablePlatform: {
		isArray: true,
		custom: {
			options: (value) => {
				value.forEach((platform) => {
					if (!botPlatforms.includes(platform)) {
						throw new Error(`${platform} is not a valid platform`);
					}
				});
				return true;
			},
		},
	},
};

// Bot Schema
const BotScheam = new Schema(
	{
		botName: {
			type: Schema.Types.String,
			required: true,
		},
		availablePlatform: {
			type: [Schema.Types.String],
			enum: botPlatforms,
		},
		botEndpoint: {
			type: Schema.Types.String,
			default: 'http://localhost:3000/',
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

export const Bot = model('bot', BotScheam);
export default Bot;
