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

// ลบแผนก (เปลี่ยนจาก DELETE เป็น POST)
router.post('/delete', authMiddleware, roleMiddleware(1), manageDeptController.deleteDepartment);

module.exports = router;