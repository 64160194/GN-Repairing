const express = require('express');
const router = express.Router();
const detailsRepairingController = require('../controllers/detailsRepairingController');

// เปลี่ยนเป็น
router.get('/:id', detailsRepairingController.getRepairDetails);

module.exports = router;