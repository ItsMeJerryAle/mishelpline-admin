const express = require('express');
const cors = require('cors');
const User = require('./../../models/user');
const DataTeam = require('./../../models/dataTeam');
const SoftwareTeam = require('./../../models/softwareTeam');
const HardwareTeam = require('./../../models/hardwareTeam');
const NetworkTeam = require('./../../models/networkTeam');
const OthersTeam = require('./../../models/othersTeam');
const Request = require('./../../models/request');
const { pusher, transporter } = require('./../../utils');

const app = express();
app.use(cors());

exports.getUsers = async (req, res) => {
	try {
		const users = await User.find({
			role: ['admin', 'faculty', 'staff', 'student'],
		}).select('_id firstName lastName email contact role');
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the users' });
	}
};

exports.getAdmins = async (req, res) => {
	try {
		const users = await User.find({
			role: ['admin'],
		}).select('_id firstName lastName email contact role');
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the admins' });
	}
};

exports.getFaculty = async (req, res) => {
	try {
		const users = await User.find({
			role: ['faculty'],
		}).select('_id firstName lastName email contact role department office');
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the admins' });
	}
};

exports.getStudents = async (req, res) => {
	try {
		const users = await User.find({
			role: ['student'],
		}).select('_id firstName lastName email contact role');
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the admins' });
	}
};

exports.getStaffs = async (req, res) => {
	try {
		const users = await User.find({
			role: ['staff'],
		}).select('_id firstName lastName email contact role office');
		res.status(200).json(users);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the admins' });
	}
};

exports.getTeams = async (req, res) => {
	try {
		const teams = await Team.find({});
		res.status(200).json(teams);
	} catch (e) {
		res.status(400).send({ message: 'Cannot get the admins' });
	}
};

exports.getTeam = async (req, res) => {
	try {
		if (req.params.type === 'data') {
			const teams = await DataTeam.find({ type: req.params.type }).populate(
				'members'
			);
			res.status(200).json(teams);
		}
		if (req.params.type === 'software') {
			const teams = await SoftwareTeam.find({ type: req.params.type }).populate(
				'members'
			);
			res.status(200).json(teams);
		}
		if (req.params.type === 'hardware') {
			const teams = await HardwareTeam.find({ type: req.params.type }).populate(
				'members'
			);
			res.status(200).json(teams);
		}
		if (req.params.type === 'network') {
			const teams = await NetworkTeam.find({ type: req.params.type }).populate(
				'members'
			);
			res.status(200).json(teams);
		}
		if (req.params.type === 'others') {
			const teams = await OthersTeam.find({ type: req.params.type }).populate(
				'members'
			);
			res.status(200).json(teams);
		}
	} catch (e) {
		console.log(e);
		res.status(400).send({ message: 'Unable to create the team' });
	}
};

exports.team = async (req, res) => {
	try {
		const { type, members } = req.body;
		if (type === 'data') {
			const dataTeam = await DataTeam.findOneAndUpdate(
				{ type: 'data' },
				{
					$push: {
						members: members,
					},
				},
				{ new: true }
			);
			pusher.trigger('team', 'updated', dataTeam);
			return res.status(200).json({ message: 'Success!' });
		}
		if (type === 'software') {
			const softwareTeam = await SoftwareTeam.findOneAndUpdate(
				{ type: 'software' },
				{
					$push: {
						members: members,
					},
				},
				{ upsert: true, new: true }
			);
			pusher.trigger('team', 'updated', softwareTeam);
			return res.status(200).json({ message: 'Success!' });
		}
		if (type === 'hardware') {
			const hardwareTeam = await HardwareTeam.findOneAndUpdate(
				{ type: 'hardware' },
				{
					$push: {
						members: members,
					},
				},
				{ upsert: true, new: true }
			);
			pusher.trigger('team', 'updated', hardwareTeam);
			return res.status(200).json({ message: 'Success!' });
		}
		if (type === 'network') {
			const networkTeam = await NetworkTeam.findOneAndUpdate(
				{ type: 'network' },
				{
					$push: {
						members: members,
					},
				},
				{ upsert: true, new: true }
			);
			pusher.trigger('team', 'updated', networkTeam);
			return res.status(200).json({ message: 'Success!' });
		}
		if (type === 'others') {
			const othersTeam = await OthersTeam.findOneAndUpdate(
				{ type: 'others' },
				{
					$push: {
						members: members,
					},
				},
				{ upsert: true, new: true }
			);
			pusher.trigger('team', 'updated', othersTeam);
			return res.status(200).json({ message: 'Success!' });
		}
	} catch (e) {
		console.log(e);
		res.status(400).send({ message: 'Something went wrong!' });
	}
};

exports.changeToAdmin = async (req, res) => {
	try {
		const existingUser = await User.findOne({ _id: req.params.id });

		if (existingUser) {
			await User.findByIdAndUpdate(req.params.id, {
				role: 'admin',
			});
			pusher.trigger('users', 'updated', updatedUser);
			res.status(200).send({
				message: 'A user is successfully turned into Admin!',
			});
		}
	} catch (e) {
		res.status(400).send({ message: 'Error to change the role' });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findById(req.params.id);
		await Req.findAndDelete({ user: req.params.id });
		await User.findByIdAndDelete(req.params.id);

		pusher.trigger('users', 'deleted-user', deletedUser);
		res.status(200).send({
			message: 'A user is successfully deleted!',
		});
	} catch (error) {
		res.status(400).json({
			message: 'Something went wrong.',
		});
	}
};

exports.deleteMember = async (req, res) => {
	try {
		if (req.params.data === 'data') {
			const dataMember = await DataTeam.findOneAndUpdate(
				{ type: 'data' },
				{
					$pullAll: {
						members: [{ _id: req.params.id }],
					},
				}
			);
			pusher.trigger('team', 'updated', dataMember);
			return res.status(200).json({ message: 'Success!' });
		}
		if (req.params.data === 'software') {
			const softwareMember = await SoftwareTeam.findOneAndUpdate(
				{ type: 'software' },
				{
					$pull: {
						members: [{ _id: req.params.id }],
					},
				}
			);
			pusher.trigger('team', 'updated', softwareMember);
			return res.status(200).json({ message: 'Success!' });
		}
		if (req.params.data === 'hardware') {
			const hardwareMember = await HardwareTeam.findOneAndUpdate(
				{ type: 'data' },
				{
					$pull: {
						members: [{ _id: req.params.id }],
					},
				}
			);
			pusher.trigger('team', 'updated', hardwareMember);
			return res.status(200).json({ message: 'Success!' });
		}
		if (req.params.data === 'network') {
			const networkMember = await NetworkTeam.findOneAndUpdate(
				{ type: 'data' },
				{
					$pull: {
						members: [{ _id: req.params.id }],
					},
				}
			);
			pusher.trigger('team', 'updated', networkMember);
			return res.status(200).json({ message: 'Success!' });
		}
		if (req.params.data === 'others') {
			const othersMember = await OthersTeam.findOneAndUpdate(
				{ type: 'data' },
				{
					$pull: {
						members: [{ _id: req.params.id }],
					},
				}
			);
			pusher.trigger('team', 'updated', othersMember);
			return res.status(200).json({ message: 'Success!' });
		}
	} catch (error) {
		res.status(400).json({
			message: 'Something went wrong.',
		});
	}
};

exports.approveReq = async (req, res) => {
	try {
		const existingReq = await Request.findById(req.params.id);
		const { personel } = req.body;

		if (existingReq) {
			const approvedReq = await Request.findByIdAndUpdate(req.params.id, {
				approved: true,
				pending: true,
				personel: personel,
			});

			const userRequested = await User.findById(approvedReq.user);

			transporter
				.sendMail({
					from: '"MIS Helpline"', // sender address
					to: userRequested.email, // list of receivers
					subject: 'MIS Approved Request', // Subject line
					text: `Hi ${userRequested.firstName}, your request has already been approved and our team is on its way to help you on your request.`, // plain text body
					html: `<b>Hi ${userRequested.firstName}, your request has already been approved and our team is on its way to help you on your request.</b>`, // html body
				})
				.catch(console.error);

			pusher.trigger('request', 'updated', approvedReq);
			res.status(200).send({
				message: 'Success',
			});
		}
	} catch (e) {
		console.log(e);
		res.status(400).send({ message: 'Error to approve the request' });
	}
};

exports.rejectReq = async (req, res) => {
	try {
		const { reason } = req.body;
		const existingReq = await Request.findById(req.params.id);

		if (existingReq) {
			const rejectedReq = await Request.findByIdAndUpdate(req.params.id, {
				reason,
				rejected: true,
				pending: false,
			});

			const userRequested = await User.findById(rejectedReq.user);

			transporter
				.sendMail({
					from: '"MIS Helpline"', // sender address
					to: userRequested.email, // list of receivers
					subject: 'MIS Rejected Request', // Subject line
					text: `Hi ${userRequested.firstName}, we apologize that we can not fulfill your request due to: ${reason}`, // plain text body
					html: `<b>Hi ${userRequested.firstName}, we apologize that we can not fulfill your request due to: ${reason}</b>`, // html body
				})
				.catch(console.error);

			pusher.trigger('request', 'updated', rejectedReq);
			res.status(200).send({
				message: 'Success',
			});
		}
	} catch (e) {
		res.status(400).send({ message: 'Something went wrong!' });
	}
};
