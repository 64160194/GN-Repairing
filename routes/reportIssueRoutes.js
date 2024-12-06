const express = require('express');
const router = express.Router();
const reportIssueController = require('../controllers/reportIssueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// แสดงหน้ารายงาน
router.get('/', authMiddleware, roleMiddleware([1, 2]), reportIssueController.showReportIssuePage);

// สร้างรายงาน
router.post('/generate', authMiddleware, roleMiddleware([1, 2]), reportIssueController.generateReport);

module.exports = router;