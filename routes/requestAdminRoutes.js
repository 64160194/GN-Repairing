const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const requestAdminController = require('../controllers/requestAdminController');

router.get('/', authMiddleware, roleMiddleware(1), requestAdminController.showRequestAdmin);
router.get('/view/:id', authMiddleware, roleMiddleware(1), requestAdminController.viewRequest);

module.exports = router;