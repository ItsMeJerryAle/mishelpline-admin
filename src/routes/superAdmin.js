const express = require('express');
const {
	getUsers,
	getAdmins,
	getFaculty,
	getStaffs,
	getStudents,
	getTeam,
	changeToAdmin,
	deleteUser,
	approveReq,
	rejectReq,
	team,
	deleteMember,
} = require('../controllers/Super Admin');
const { checkJwt, attachUser, requireSuperAdmin } = require('./../middlewares');
const router = express.Router();

router.get('/users', attachUser, checkJwt, requireSuperAdmin, getUsers);
router.get('/users/admins', attachUser, checkJwt, requireSuperAdmin, getAdmins);
router.get(
	'/users/student',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	getStudents
);
router.get('/users/staff', attachUser, checkJwt, requireSuperAdmin, getStaffs);
router.get(
	'/users/faculty',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	getFaculty
);
router.get('/teams/:type', attachUser, checkJwt, requireSuperAdmin, getTeam);
router.patch('/teams', attachUser, checkJwt, requireSuperAdmin, team);
router.patch(
	'/teams/:id/:data',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	deleteMember
);
router.patch(
	'/users/admin/:id',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	changeToAdmin
);
router.patch(
	'/request/approve/:id',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	approveReq
);
router.patch(
	'/request/reject/:id',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	rejectReq
);
router.delete(
	'/users/:id',
	attachUser,
	checkJwt,
	requireSuperAdmin,
	deleteUser
);

module.exports = router;
