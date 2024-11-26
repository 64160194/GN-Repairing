const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
  res.render('request_admin', { title: 'Admin Request', user: req.user });
});

module.exports = router;