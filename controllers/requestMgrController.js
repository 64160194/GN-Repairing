const RequestMgrModel = require('../models/requestMgrModel');
const emailService = require('../services/emailService');

const requestMgrController = {
  showRequestMgr: async (req, res) => {
    try {
      if (!req.session.userId || !req.session.deptId) {
        return res.redirect('/');
      }

      const requests = await RequestMgrModel.getRequestsByDepartment(req.session.deptId);
      const currentUser = await RequestMgrModel.getUserInfo(req.session.userId);

      res.render('request_mgr', {
        requests: requests,
        userDeptId: req.session.deptId,
        currentUser: currentUser
      });
    } catch (error) {
      res.status(500).render('error', { message: 'An error occurred while loading the request manager page.' });
    }
  },

  viewRequest: async (req, res) => {
    try {
      console.log('Session data:', req.session);

      if (!req.session.userId || !req.session.deptId) {
        console.log('User not authenticated, redirecting to login');
        return res.redirect('/');
      }
  
      const requestId = req.params.id;
      console.log('Requested ID:', requestId);
  
      const request = await RequestMgrModel.getRequestById(requestId);
      console.log('Request data from database:', request);
  
      const currentUser = await RequestMgrModel.getUserInfo(req.session.userId);
      console.log('Current user data:', currentUser);
  
      if (!request) {
        console.log('Request not found');
        return res.status(404).render('error', { message: 'Request not found.' });
      }

      res.render('request_mgr_view', { request, currentUser });
    } catch (error) {
      console.error('Error in viewRequest:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request details.' });
    }
  },

  handleRequest: async (req, res) => {
    try {
      const { req_id, is_approved } = req.body;
      console.log('Received request:', { req_id, is_approved });

      const status = is_approved ? 'approve' : 'reject';
      const result = await RequestMgrModel.updateApprovalStatus(req_id, status);

      console.log('Processing result:', result);

      if (result.success) {
        if (is_approved) {
          // Get request details
          const request = await RequestMgrModel.getRequestById(req_id);
          
          // Get approver details (current user)
          const approver = await RequestMgrModel.getUserInfo(req.session.userId);
          
          // Get HR&GA manager (role_id 2)
          const hrgaManager = await RequestMgrModel.getUserByRoleId(2);
          
          if (hrgaManager) {
            // Send email notification to HR&GA manager
            await emailService.sendApprovalNotificationToHRGA(request, approver, hrgaManager);
            console.log('Email sent to HR&GA manager');
          } else {
            console.log('HR&GA manager not found');
          }
        }
      }

      res.json(result);
    } catch (error) {
      console.error('Error in handleRequest:', error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
    }
  },

};

module.exports = requestMgrController;