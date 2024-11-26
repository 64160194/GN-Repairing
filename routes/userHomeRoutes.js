const express = require('express');
const router = express.Router();
const userHomeController = require('../controllers/userHomeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(3), userHomeController.showUserHome);

module.exports = router;