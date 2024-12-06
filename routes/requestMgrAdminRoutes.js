const express = require('express');
const router = express.Router();
const requestMgrAdminController = require('../controllers/requestMgrAdminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Assuming role ID 5 is for HR&GA manager
router.get('/', authMiddleware, roleMiddleware(2), requestMgrAdminController.showRequestMgrAdminPage);

// Add more routes as needed

module.exports = router;