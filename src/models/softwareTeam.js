const mongoose = require('mongoose');

const SoftwareTeamSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
			enum: ['software'],
		},
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('sofware-team', SoftwareTeamSchema);
