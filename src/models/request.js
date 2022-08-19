const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
		ticketNo: {
			type: Number,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		reqType: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		approved: {
			type: Boolean,
			default: false,
		},
		rejected: {
			type: Boolean,
			default: false,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		pending: {
			type: Boolean,
			default: false,
		},
		reason: { type: String, trim: true },
		personel: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('request', RequestSchema);
