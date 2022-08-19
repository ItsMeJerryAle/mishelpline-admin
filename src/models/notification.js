const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
		notif: [
			{
				title: { type: String, required: true, trim: true },
				date: { type: Date, required: true },
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('notification', NotificationSchema);
