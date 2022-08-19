const mongoose = require('mongoose');

const NetworkTeamSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
			enum: ['network'],
		},
		members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('network-team', NetworkTeamSchema);
