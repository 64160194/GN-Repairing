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
        req.session.userId = user.u_id;
        req.session.role = user.role_id;

        // Redirect based on user role
        switch (user.role_id) {
          case 1:
            res.redirect('/request_admin');
            break;
          case 3:
            res.redirect('/user_home');
            break;
          case 4:
            res.redirect('/request_mgr');
            break;
          default:
            res.redirect('/default_home'); 
        }
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