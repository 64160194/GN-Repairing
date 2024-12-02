const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const manageDeptController = require('../controllers/manageDeptController');

router.get('/', authMiddleware, roleMiddleware(1), manageDeptController.getDepartments);

module.exports = router;