const express = require('express');
const { completeRequest } = require('../controllers/Admin');
const { checkJwt, attachUser, requireAdmin } = require('./../middlewares');
const router = express.Router();

router.patch(
	'/request/complete/:id',
	attachUser,
	checkJwt,
	requireAdmin,
	completeRequest
);

module.exports = router;
