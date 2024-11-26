const express = require('express');
const router = express.Router();
const addRequestController = require('../controllers/addRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/add_request', authMiddleware, addRequestController.showAddRequestPage);
router.post('/add_request', authMiddleware, addRequestController.processAddRequest);

module.exports = router;