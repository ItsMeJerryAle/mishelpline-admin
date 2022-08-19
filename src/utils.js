const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Pusher = require('pusher');
const nodemailer = require('nodemailer');

const createToken = (user) => {
	// Sign the JWT
	if (!user.role) {
		throw new Error('No user role specified');
	}
	if (!user._id) {
		throw new Error('No user id specified');
	}

	return jwt.sign(
		{
			sub: user._id,
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			iss: 'api.mishelpline',
			aud: 'api.mishelpline',
		},
		process.env.JWT_SECRET_KEY,
		{ algorithm: 'HS256', expiresIn: '5h' }
	);
};

const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		// Generate a salt at level 12 strength
		bcrypt.genSalt(12, (err, salt) => {
			if (err) {
				reject(err);
			}
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err);
				}
				resolve(hash);
			});
		});
	});
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
	return bcrypt.compare(passwordAttempt, hashedPassword);
};

const pusher = new Pusher({
	appId: process.env.APP_ID,
	key: process.env.APP_KEY,
	secret: process.env.APP_SECRET,
	cluster: process.env.APP_CLUSTER,
	useTLS: true,
});

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	requireTLS: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

module.exports = {
	createToken,
	hashPassword,
	verifyPassword,
	pusher,
	transporter
};
