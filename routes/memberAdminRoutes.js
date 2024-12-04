const express = require('express');
const router = express.Router();
const memberAdminController = require('../controllers/memberAdminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(1), memberAdminController.showMemberAdminPage);
router.post('/add', authMiddleware, roleMiddleware(1), memberAdminController.addMember);
router.post('/update', authMiddleware, roleMiddleware(1), memberAdminController.updateMember);
router.get('/delete/:id', authMiddleware, roleMiddleware(1), memberAdminController.deleteMember);

module.exports = router;