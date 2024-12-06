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
          message: 'Please fill in all the required fields. กรุณากรอกข้อมูลให้ครบทุกช่อง'
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(u_mail)) {
        return res.json({
          success: false,
          message: 'The Email format is invalid. รูปแบบอีเมลไม่ถูกต้อง'
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
        message: 'Member added successfully เพิ่มสมาชิกสำเร็จ'
      });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ success: false, message: 'An error occurred while adding the member.' });
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
      const userId = req.params.id;
      const result = await MemberAdminModel.updateMemberStatus(userId, 0);
      if (result) {
        res.json({ success: true, message: 'The member has been removed from the system.' });
      } else {
        res.json({ success: false, message: 'Unable to delete the member.' });
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).json({ success: false, message: 'An error occurred while deleting the member.' });
    }
  }
};

module.exports = memberAdminController;