const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const manageDeptController = require('../controllers/manageDeptController');

// แสดงหน้าจัดการแผนก
router.get('/', authMiddleware, roleMiddleware(1), manageDeptController.getDepartments);

// เพิ่มแผนกใหม่
router.post('/add', authMiddleware, roleMiddleware(1), manageDeptController.addDepartment);

// อัปเดตข้อมูลแผนก
router.post('/update', authMiddleware, roleMiddleware(1), manageDeptController.updateDepartment);

// ลบแผนก
router.delete('/delete/:id', authMiddleware, roleMiddleware(1), manageDeptController.deleteDepartment);

// สลับสถานะแผนก (เปิด/ปิด)
router.put('/toggle/:id', authMiddleware, roleMiddleware(1), manageDeptController.toggleDepartmentStatus);

module.exports = router;