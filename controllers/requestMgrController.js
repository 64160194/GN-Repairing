const RequestMgrModel = require('../models/requestMgrModel');

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
      if (!req.session.userId || !req.session.deptId) {
        return res.redirect('/');
      }

      const requestId = req.params.id;
      const request = await RequestMgrModel.getRequestById(requestId);
      const currentUser = await RequestMgrModel.getUserInfo(req.session.userId);

      if (!request) {
        return res.status(404).render('error', { message: 'Request not found.' });
      }

      res.render('request_mgr_view', { request, currentUser });
    } catch (error) {
      res.status(500).render('error', { message: 'An error occurred while loading the request details.' });
    }
  },

  handleRequest: async (req, res) => {
      try {
          const { req_id, is_approved } = req.body;
          console.log('Received request:', { req_id, is_approved }); // เพิ่ม log เพื่อตรวจสอบค่าที่ได้รับ
  
          const result = await RequestMgrModel.handleRequest(req_id, is_approved);
  
          console.log('Processing result:', result); // เพิ่ม log เพื่อตรวจสอบผลลัพธ์
  
          res.json(result);
      } catch (error) {
          console.error('Error in handleRequest:', error);
          res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
      }
  },
};

module.exports = requestMgrController;