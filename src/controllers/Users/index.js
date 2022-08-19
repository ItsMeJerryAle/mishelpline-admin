const express = require('express');
const cors = require('cors');
const User = require('./../../models/user');
const cookieParser = require('cookie-parser');
const jwtDecode = require('jwt-decode');
const Req = require('./../../models/request');
const {
	createToken,
	verifyPassword,
	hashPassword,
	pusher,
	transporter,
} = require('./../../utils');

const app = express();
app.use(cors());
app.use(cookieParser());

exports.getRequests = async (req, res) => {
	try {
		const requests = await Req.find({}).populate('user').lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({});
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getUserRequests = async (req, res) => {
	try {
		const requests = await Req.find({ user: req.user.sub }).lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getUserAssignedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ personel: req.user.sub })
			.populate('user')
			.lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getCompleteRequests = async (req, res) => {
	try {
		const requests = await Req.find({ completed: true })
			.populate('user')
			.lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getApproveReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ approved: true });
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getCompleteReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ completed: true });
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getPendingRequests = async (req, res) => {
	try {
		const requests = await Req.find({ pending: true })
			.populate('user')
			.populate('personel')
			.lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getPendingReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ pending: true });
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getRejectedRequests = async (req, res) => {
	try {
		const requests = await Req.find({ rejected: true }).populate('user').lean();
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getRejectedReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ rejected: true });
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getDataReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({ title: 'data', pending: true });
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getSoftwareReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({
			title: 'software',
			pending: true,
		});
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getHardwareReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({
			title: 'hardware',
			pending: true,
		});
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getNetworkReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({
			title: 'network',
			pending: true,
		});
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.getOtherReqCount = async (req, res) => {
	try {
		const requests = await Req.countDocuments({
			title: 'others',
			pending: true,
		});
		res.status(200).json({
			message: 'Successfully fetched requests!',
			requests,
		});
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({
			email,
		})
			.select('+password')
			.lean();

		if (!user)
			return res.status(400).json({ message: 'Wrong email or password.' });

		const passwordValid = await verifyPassword(password, user?.password);

		if (passwordValid) {
			const { password, ...rest } = user;
			const userInfo = Object.assign({}, { ...rest });

			const token = createToken(userInfo);

			const decodedToken = jwtDecode(token);
			const expiresAt = decodedToken.exp;

			res.cookie('token', token, {
				httpOnly: true,
			});

			res.json({
				message: 'Authentication successful!',
				token,
				userInfo,
				expiresAt,
			});
		} else {
			res.status(400).json({
				message: 'Wrong email or password.',
			});
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({ message: 'Something went wrong.' });
	}
};

exports.signup = async (req, res) => {
	try {
		const { email, firstName, lastName, contact, role } = req.body;

		const hashedPassword = await hashPassword(req.body.password);

		const splitedEmail = email.split('@');
		if (splitedEmail[1] !== 'bisu.edu.ph')
			return res.status(400).json({ message: 'Email should be a BISU email!' });

		const userData = {
			email: email.toLowerCase(),
			firstName,
			lastName,
			contact,
			password: hashedPassword,
			role,
		};
		if (role === 'staff') {
			Object.assign(userData, { office: req.body.office });
		}
		if (role === 'faculty') {
			Object.assign(userData, {
				department: req.body.department,
				office: req.body.office,
			});
		}

		const existingEmail = await User.findOne({
			email: userData.email,
		}).lean();

		if (existingEmail)
			return res.status(400).json({ message: 'Email already exists' });

		// console.log(userData);
		const newUser = new User(userData);
		const savedUser = await newUser.save();

		if (savedUser)
			pusher.trigger('users', 'created', {
				_id: savedUser._id,
				email: savedUser.email,
				firstName: savedUser.firstName,
				lastName: savedUser.lastName,
				contact: savedUser.contact,
				role: savedUser.role,
			});
		return res.status(201).json({
			message: 'Registered successfully',
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			message: 'There was a problem creating your account',
		});
	}
};

exports.request = async (req, res) => {
	try {
		let bodyText = '';
		const { title, reqType, description } = req.body;
		const { sub } = req.user;

		const reqData = {
			user: sub,
			title,
			reqType,
			description,
		};

		// const ticket = Math.floor(1000 + Math.random() * 9000);

		const newRequest = new Req(reqData);
		const savedRequest = await newRequest.save();

		const requestedUser = await User.findById(savedRequest?.user).lean();

		if (requestedUser?.role === 'student')
			bodyText = `A <b>${requestedUser?.role}</b> named <b>${requestedUser?.firstName} ${requestedUser?.lastName}</b> has requested a <b>${savedRequest?.reqType}</b> in <b>${savedRequest?.title}</b>`;
		if (requestedUser?.role === 'staff')
			bodyText = `A <b>${requestedUser?.role}</b> named ${requestedUser?.firstName} ${requestedUser?.lastName} has requested a <b>${savedRequest?.reqType}</b> in <b>${savedRequest?.title}</b>`;
		if (requestedUser?.role === 'faculty')
			bodyText = `A <b>${requestedUser?.role}</b> named <b>${
				requestedUser?.firstName
			} ${requestedUser?.lastName}</b> of <b>${
				requestedUser?.department
			}</b> department at${
				requestedUser?.office ? ' ' + requestedUser?.office : ''
			} office has requested a <b>${savedRequest?.reqType}</b> in <b>${
				savedRequest?.title
			}</b>`;

		transporter
			.sendMail({
				from: '"MIS Helpline"', // sender address
				to: process.env.MAIL_USER, // list of receivers
				subject: 'MIS Request', // Subject line
				text: `Request`, // plain text body
				html: bodyText, // html body
			})
			.catch(console.error);
		pusher.trigger('request', 'created', savedRequest);
		return res.status(201).json({
			message: 'Request created successfully!',
			_id: savedRequest._id,
			ticketNo: Math.floor(1000 + Math.random() * 9000),
			reqType: reqType,
		});
	} catch (e) {
		console.log(e);
		res.status(400).json({
			message: 'There was a problem creating your request!',
		});
	}
};

exports.ticket = async (req, res) => {
	try {
		const { ticketNo } = req.body;
		const requestData = await Req.findOne({ _id: req.params.id });

		if (!requestData)
			return res.status(400).json({ message: 'Request not found!' });

		const addTicket = await Req.findByIdAndUpdate(
			{
				_id: req.params.id,
			},
			{
				ticketNo: ticketNo,
			},
			{ new: true }
		);

		if (addTicket) {
			await addTicket.save();
			pusher.trigger('request', 'updated', addTicket);
			return res.status(200).json({ message: 'Success' });
		}
	} catch (e) {
		console.log(e);
		res.status(400).json({
			message: 'There was a problem creating your request!',
		});
	}
};

exports.logout = (req, res) => {
	try {
		res.clearCookie('token', {
			httpOnly: true,
		});
		res
			.status(200)
			.json({ success: true, message: 'User logged out successfully' });
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong!' });
	}
};

exports.cancelRequest = async (req, res) => {
	try {
		const canceledReq = await User.findById(req.params.id);
		await Req.findByIdAndDelete(req.params.id);
		pusher.trigger('request', 'deleted-req', canceledReq);
		res.status(200).json({
			message: 'Successfully canceled requests!',
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: 'Something went wrong!' });
	}
};
