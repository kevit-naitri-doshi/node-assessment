import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Config from '../../environment/index.js';
import HttpException from '../../utils/error.utils.js';
import { USER_ERROR_CODES } from './user.errors.js';

const { Schema, model } = mongoose;

const availablePlans = ['free', 'basic', 'Hero', 'King', 'God'];
// ===============================================================================
// APIs schema to validate requests
// ===============================================================================
/**
 * signUpUser
 * @method POST
 * @path /users
 */
export const signUpUserSchema = {
	firstName: {
		errorMessage: 'First name is required in request',
		isString: true,
		isLength: {
			options: { min: 3 },
		},
	},
	emailId: {
		isEmail: true,
		errorMessage: 'Plaese enter valid email',
	},
	planType: {
		custom: {
			options: (value) => {
				const validPlans = availablePlans;
				if (!validPlans.includes(value)) {
					throw new Error('Invalid plan type');
				}
				return true;
			},
		},
	},
	mobileNo: {
		isMobilePhone: true,
		errorMessage: 'Please enter valid Phone Number',
	},
	password: {
		isStrongPassword: true,
		isLength: {
			options: {
				min: 8,
			},
		},
	},
};

/**
 * signInUser
 * @method POST
 * @path /users/signIn
 */
export const signInUserSchema = {
	email: {
		isEmail: true,
		errorMessage: 'Enter valid email Id',
	},
	password: {
		isString: true,
		errorMessage: 'Enter valid password',
	},
};

// ----------------------------------------------------------------------------
// User Schema for store in DB
// ----------------------------------------------------------------------------
const userSchema = new Schema({
	firstName: {
		type: Schema.Types.String,
		required: true,
	},
	lastName: Schema.Types.String,
	emailId: Schema.Types.String,
	planType: {
		type: Schema.Types.String,
		enum: availablePlans,
		required: true,
	},
	mobileNo: Schema.Types.String,
	password: { type: Schema.Types.String, required: true },
	accessToken: Schema.Types.String,
	profilePicture: Schema.Types.String,
});

// --------------------------------------------------------------------------------------------------
// User's statics methods
// --------------------------------------------------------------------------------------------------
userSchema.statics.findByCredentials = async function (email, password) {
	const user = await this.findOne({ emailId: email });
	if (!user) {
		throw new HttpException(
			404,
			USER_ERROR_CODES.USER_NOT_FOUND,
			'USER_NOT_FOUND',
			null,
			{
				emailId: email,
			},
		);
	}

	const res = await bcryptjs.compare(password, user.password);

	if (res === true) {
		return user;
	}
	throw new HttpException(
		404,
		USER_ERROR_CODES.INCORRECT_PASSWORD,
		'INCORRECT_PASSWORD',
		null,
	);
};

userSchema.statics.findByToken = async function (token) {
	let decoded;
	try {
		decoded = jwt.verify(token, Config.JWT_PUBLIC_KEY);
	} catch (err) {
		let hasSessionExpired = false;
		if (err && err.message && err.message.includes('jwt expired')) {
			hasSessionExpired = true;
		}
		if (hasSessionExpired) {
			throw new HttpException(
				404,
				USER_ERROR_CODES.USER_SESSION_EXPIRED,
				'USER_SESSION_EXPIRED',
				null,
			);
		} else {
			throw new HttpException(
				404,
				USER_ERROR_CODES.AUTH_FAILED,
				'AUTH_FAILED',
				null,
			);
		}
	}
	return this.findOne({
		_id: decoded._id,
		accessToken: token,
	});
};

// --------------------------------------------------------------------------------
// User's general methods
// --------------------------------------------------------------------------------
userSchema.methods.getAuthToken = function () {
	// "this" here refers to User doc
	const access = 'auth';
	const token = jwt
		.sign({ _id: this._id.toHexString(), access }, Config.JWT_PRIVATE_KEY, {
			expiresIn: '3d', // 3 days
			algorithm: 'RS256',
		})
		.toString();

	this.accessToken = token;

	return this.save().then(() => token);
};

// --------------------------------------------------------------------------------
// User's hooks (pre & post)
// --------------------------------------------------------------------------------
userSchema.pre('save', function (next) {
	const user = this;
	if (user.password && !user.accessToken) {
		bcryptjs.genSalt(10, (error, salt) => {
			bcryptjs.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.index({ emailId: 1 }, { unique: true });
export const User = model('user', userSchema);
export default User;
