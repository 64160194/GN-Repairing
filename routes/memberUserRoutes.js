const express = require('express');
const memberUserController = require('../controllers/memberUserController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware([4]), memberUserController.showMemberUserPage);

module.exports = router;