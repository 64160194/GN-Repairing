const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const reportIssueController = require('../controllers/reportIssueController');

router.get('/', authMiddleware, roleMiddleware([1, 2]), reportIssueController.showReportIssuePage);
router.post('/generate', authMiddleware, roleMiddleware([1, 2]), reportIssueController.generateReport);
router.get('/api/repair-types', authMiddleware, roleMiddleware([1, 2]), reportIssueController.getRepairTypesData);
router.get('/api/department-requests', authMiddleware, roleMiddleware([1, 2]), reportIssueController.getDepartmentRequestsData);

module.exports = router;