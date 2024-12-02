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
        // Set session variables
        req.session.userId = user.u_id;
        req.session.roleId = user.role_id;
        req.session.deptId = user.dept_id;
        req.session.username = user.u_name;

        // Redirect based on user role
        switch (user.role_id) {
          case 1: // Admin
            res.redirect('/request_admin');
            break;
          case 3: // Normal user
            res.redirect('/user_home');
            break;
          case 4: // Manager
            res.redirect('/request_mgr');
            break;
          default:
            res.redirect('/user_home'); // Default redirect if role is not recognized
        }
      } else {
        res.render('login', { title: 'Login', error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).render('login', { title: 'Login', error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง' });
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/');
    });
  }
};

module.exports = loginController;