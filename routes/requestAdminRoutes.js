const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// ใช้ authMiddleware ก่อน แล้วตามด้วย roleMiddleware ที่ต้องการ role_id เป็น 1
router.get('/', authMiddleware, roleMiddleware(1), (req, res) => {
  res.render('request_admin', { title: 'Admin Request', user: req.user });
});

module.exports = router;