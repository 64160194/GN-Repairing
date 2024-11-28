const UserHomeModel = require('../models/userHomeModel');

const userHomeController = {
  showUserHome: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/');
      }

      const user = await UserHomeModel.getUserById(req.session.userId);
      if (!user) {
        return res.redirect('/');
      }

      // ดึงข้อมูลรายการแจ้งซ่อมของผู้ใช้
      const requests = await UserHomeModel.getRequests(req.session.userId);

      // ส่งข้อมูล flash messages (ถ้ามี)
      const flash = req.session.flash;
      delete req.session.flash;

      res.render('user_home', { 
        user: user,
        requests: requests,
        flash: flash
      });
    } catch (error) {
      console.error('Error in showUserHome:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the user home page.' });
    }
  }
};

module.exports = userHomeController;