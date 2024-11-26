const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.showLoginPage);
router.post('/login', loginController.processLogin);

module.exports = router;