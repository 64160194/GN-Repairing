const express = require('express');
const router = express.Router();
const maintenanceWorkerController = require('../controllers/maintenanceWorkerController');

// GET: แสดงหน้ารายการช่างซ่อมบำรุง
router.get('/', maintenanceWorkerController.getAllWorkers);

// POST: เพิ่มช่างซ่อมบำรุงใหม่
router.post('/add', maintenanceWorkerController.addWorker);

// POST: อัปเดตข้อมูลช่างซ่อมบำรุง
router.post('/update', maintenanceWorkerController.updateWorker);

// POST: ลบช่างซ่อมบำรุง
router.post('/delete/:worker_id', maintenanceWorkerController.deleteWorker);

module.exports = router;