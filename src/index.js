-require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/user');
const superAdminRoute = require('./routes/superAdmin');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', userRoute);
app.use('/api', superAdminRoute);

mongoose
	.connect(process.env.ATLAS_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`API listening on localhost:${port}`);
		});
	})
	.catch((err) => {
		console.log(err.message);
	});
