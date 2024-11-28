const LoginModel = require('../models/loginModel');

const authMiddleware = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await LoginModel.getUserById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
    }
  }
  res.redirect('/');
};

module.exports = authMiddleware;