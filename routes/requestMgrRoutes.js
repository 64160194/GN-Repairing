const express = require('express');
const requestMgrController = require('../controllers/requestMgrController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(4), requestMgrController.showRequestMgrPage);

module.exports = router;