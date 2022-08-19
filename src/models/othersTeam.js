const mongoose = require('mongoose');

const OthersTeamSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
			enum: ['others'],
		},
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('others-team', OthersTeamSchema);
