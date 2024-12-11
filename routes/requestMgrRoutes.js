const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const requestMgrController = require('../controllers/requestMgrController');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(4), requestMgrController.showRequestMgr);
router.get('/view/:id', authMiddleware, roleMiddleware(4), requestMgrController.viewRequest);

module.exports = router;