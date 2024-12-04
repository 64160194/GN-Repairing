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
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(u_mail)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
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
  
      res.json({ success: true, message: 'Member added successfully', id: result.insertId });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({ success: false, message: 'An error occurred while adding the member' });
    }
  },

  updateMember: async (req, res) => {
    try {
      const { id, username, firstName, lastName, deptId, roleId } = req.body;
      await MemberAdminModel.updateMember(id, username, firstName, lastName, deptId, roleId);
      res.redirect('/member_admin');
    } catch (error) {
      console.error('Error in updateMember:', error);
      res.status(500).render('error', { message: 'An error occurred while updating the member.' });
    }
  },

  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;
      await MemberAdminModel.deleteMember(id);
      res.redirect('/member_admin');
    } catch (error) {
      console.error('Error in deleteMember:', error);
      res.status(500).render('error', { message: 'An error occurred while deleting the member.' });
    }
  }
};

module.exports = memberAdminController;