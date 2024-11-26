const express = require('express');
const router = express.Router();
const addRequestController = require('../controllers/addRequestController');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.get('/add_request', addRequestController.showAddRequestPage);
router.post('/add_request', upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), addRequestController.processAddRequest);

module.exports = router;