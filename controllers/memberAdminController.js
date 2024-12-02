const MemberAdminModel = require('../models/memberAdminModel');

const memberAdminController = {
  showMemberAdminPage: async (req, res) => {
    try {
      const members = await MemberAdminModel.getAllMembers();
      res.render('member_admin', { members: members });
    } catch (error) {
      console.error('Error in showMemberAdminPage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the member admin page.' });
    }
  },

  addMember: async (req, res) => {
    try {
      const { username, password, firstName, lastName, roleId } = req.body;
      await MemberAdminModel.addMember(username, password, firstName, lastName, roleId);
      res.redirect('/member_admin');
    } catch (error) {
      console.error('Error in addMember:', error);
      res.status(500).render('error', { message: 'An error occurred while adding a new member.' });
    }
  },

  updateMember: async (req, res) => {
    try {
      const { id, username, firstName, lastName, roleId } = req.body;
      await MemberAdminModel.updateMember(id, username, firstName, lastName, roleId);
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