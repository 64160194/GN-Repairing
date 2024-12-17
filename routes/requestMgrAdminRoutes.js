const express = require('express');
const router = express.Router();
const requestMgrAdminController = require('../controllers/requestMgrAdminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(2), requestMgrAdminController.showRequestMgrAdminPage);
router.get('/view/:id', authMiddleware, roleMiddleware(2), requestMgrAdminController.viewRequest);
router.post('/handle_request', authMiddleware, roleMiddleware(2), requestMgrAdminController.handleRequest);

module.exports = router;