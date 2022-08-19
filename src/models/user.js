const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			max: 50,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			max: 50,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		contact: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			min: 10,
		},
		password: {
			type: String,
			required: true,
			min: 8,
			select: false,
		},
		role: {
			type: String,
			required: true,
			enum: ['student', 'admin', 'faculty', 'staff', 'superAdmin'],
		},
		department: {
			type: String,
			trim: true,
			max: 50,
		},
		office: {
			type: String,
			trim: true,
			max: 50,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
