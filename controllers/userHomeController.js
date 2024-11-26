const UserHomeModel = require('../models/userHomeModel');

const userHomeController = {
  showUserHome: async (req, res) => {
    try {
      // ตรวจสอบว่ามี userId ใน session หรือไม่
      if (!req.session.userId) {
        return res.redirect('/');
      }

      // ดึงข้อมูลผู้ใช้จาก database
      const user = await UserHomeModel.getUserById(req.session.userId);

      if (!user) {
        // ถ้าไม่พบข้อมูลผู้ใช้ ให้ redirect กลับไปหน้า login
        return res.redirect('/');
      }

      // เรนเดอร์หน้า user_home และส่งข้อมูลผู้ใช้ไปด้วย
      res.render('user_home', { user: user });
    } catch (error) {
      console.error('Error in showUserHome:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the user home page.' });
    }
  }
};

module.exports = userHomeController;