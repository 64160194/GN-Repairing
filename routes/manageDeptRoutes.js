const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const manageDeptController = require('../controllers/manageDeptController');

router.get('/', authMiddleware, roleMiddleware(1), manageDeptController.getDepartments);

router.post('/add', authMiddleware, roleMiddleware(1), manageDeptController.addDepartment);

router.post('/update', authMiddleware, roleMiddleware(1), manageDeptController.updateDepartment);

router.post('/delete', authMiddleware, roleMiddleware(1), manageDeptController.deleteDepartment);
router.get('/api/check-department-users/:deptId', authMiddleware, roleMiddleware(1), manageDeptController.checkDepartmentUsers);

module.exports = router;