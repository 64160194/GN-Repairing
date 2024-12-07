const express = require('express');
const router = express.Router();
const reportIssueController = require('../controllers/reportIssueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// แสดงหน้ารายงาน
router.get('/', authMiddleware, roleMiddleware([1, 2]), reportIssueController.showReportIssuePage);
router.get('/api/repair-types', authMiddleware, roleMiddleware([1, 2]), reportIssueController.getRepairTypeCounts);

module.exports = router;