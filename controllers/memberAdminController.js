const MemberAdminModel = require('../models/memberAdminModel');
const DeptRoleModel = require('../models/deptRoleModel');

const memberAdminController = {
  showMemberAdminPage: async (req, res) => {
    try {
      const members = await MemberAdminModel.getAllMembers();
      const departments = await DeptRoleModel.getAllDepartments();
      const roles = await DeptRoleModel.getAllRoles();

      res.render('member_admin', { members, departments, roles });
    } catch (error) {
      console.error('Error in showMemberAdminPage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the member admin page.' });
    }
  },

  addMember: async (req, res) => {
    try {
      const { u_name, u_pass, u_mail, f_name, l_name, dept_id, role_id } = req.body;

      // Basic validation
      if (!u_name || !u_pass || !u_mail || !f_name || !l_name || !dept_id || !role_id) {
        return res.json({
          success: false,
          message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(u_mail)) {
        return res.json({
          success: false,
          message: 'รูปแบบอีเมลไม่ถูกต้อง'
        });
      }

      const result = await MemberAdminModel.addMember({
        u_name,
        u_pass,
        u_mail,
        f_name,
        l_name,
        dept_id,
        role_id
      });

      res.json({
        success: true,
        message: 'เพิ่มสมาชิกสำเร็จ'
      });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่มสมาชิก' });
    }
  },

  updateMember: async (req, res) => {
      try {
          const { id, dept_id } = req.body;
          await MemberAdminModel.updateMemberDepartment(id, dept_id);
          res.json({ success: true, message: 'Member updated successfully' });
      } catch (error) {
          console.error('Error in updateMember:', error);
          res.status(500).json({ success: false, message: 'An error occurred while updating the member' });
      }
  },

  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;
      await MemberAdminModel.deleteMember(id);
      res.json({ success: true, message: 'Member deleted successfully' });
    } catch (error) {
      console.error('Error in deleteMember:', error);
      res.status(500).json({ success: false, message: 'An error occurred while deleting the member' });
    }
  }
};

module.exports = memberAdminController;