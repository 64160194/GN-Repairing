const LoginModel = require('../models/loginModel');

const loginController = {
  showLoginPage: (req, res) => {
    res.render('login', { title: 'Login', error: null });
  },

  processLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await LoginModel.authenticateUser(username, password);
      if (user) {
        req.session.userId = user.u_id; // เก็บ u_id ใน session
        res.redirect('/user_home');
      } else {
        res.render('login', { title: 'Login', error: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).render('login', { title: 'Login', error: 'An error occurred during login. Please try again.' });
    }
  }
};

module.exports = loginController;