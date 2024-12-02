const MemberUserModel = require('../models/memberUserModel');

const memberUserController = {
  showMemberUserPage: async (req, res) => {
    try {
      if (!req.session.userId || !req.session.deptId || !req.session.roleId) {
        return res.redirect('/');
      }

      // ตรวจสอบว่า role_id เป็น 4 (mgr_user) หรือไม่
      if (req.session.roleId !== 4) {
        return res.status(403).render('error', { 
          message: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาเข้าสู่ระบบด้วยบัญชีผู้จัดการ' 
        });
      }

      const members = await MemberUserModel.getAllMembers(req.session.deptId);
      const currentUser = await MemberUserModel.getMemberById(req.session.userId);

      res.render('member_user', { 
        members: members,
        currentUser: currentUser,
        userRole: req.session.roleId
      });
    } catch (error) {
      console.error('Error in showMemberUserPage:', error);
      res.status(500).render('error', { 
        message: 'เกิดข้อผิดพลาดในการโหลดหน้าสมาชิกผู้ใช้ กรุณาลองใหม่อีกครั้ง' 
      });
    }
  }
};

module.exports = memberUserController;