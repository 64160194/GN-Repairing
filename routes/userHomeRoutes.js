const express = require('express');
const router = express.Router();
const userHomeController = require('../controllers/userHomeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, userHomeController.showUserHome);

module.exports = router;