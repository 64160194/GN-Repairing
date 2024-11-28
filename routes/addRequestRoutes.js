const express = require('express');
const router = express.Router();
const addRequestController = require('../controllers/addRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(3), addRequestController.showAddRequestPage);
router.post('/', authMiddleware, roleMiddleware(3), addRequestController.processAddRequest);

module.exports = router;