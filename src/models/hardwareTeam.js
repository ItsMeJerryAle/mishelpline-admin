const mongoose = require('mongoose');

const HardwareTeamSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
			enum: ['hardware'],
		},
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('hardware-team', HardwareTeamSchema);
