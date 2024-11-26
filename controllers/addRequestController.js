const addRequestModel = require('../models/addRequestModel');

const addRequestController = {
  showAddRequestPage: async (req, res) => {
    try {
      const userId = req.session.userId; // สมมติว่าเรามี userId ใน session
      const userInfo = await addRequestModel.getUserInfo(userId);
      res.render('add_request', { title: 'Add New Request', userInfo: userInfo });
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the page.' });
    }
  },

  processAddRequest: (req, res) => {
    // ตรงนี้จะเป็นลอจิกสำหรับการประมวลผลการเพิ่มคำขอใหม่
    // คุณจะต้องเพิ่มลอจิกการบันทึกข้อมูลลงในฐานข้อมูลที่นี่
    res.redirect('/user_home');
  }
};

module.exports = addRequestController;