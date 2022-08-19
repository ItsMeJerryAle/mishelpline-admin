const mongoose = require('mongoose');

const DataTeamSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
			enum: ['data'],
		},
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('data-team', DataTeamSchema);