const RequestMgrModel = require('../models/requestMgrModel');

const requestMgrController = {
  showRequestMgr: async (req, res) => {
    try {
      if (!req.session.userId || !req.session.deptId) {
        return res.redirect('/');
      }

      const requests = await RequestMgrModel.getRequestsByDepartment(req.session.deptId);

      res.render('request_mgr', { 
        requests: requests,
        userDeptId: req.session.deptId
      });
    } catch (error) {
      console.error('Error in showRequestMgr:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request manager page.' });
    }
  },

  viewRequest: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await RequestMgrModel.getRequestById(requestId);
      
      if (!request) {
        return res.status(404).render('error', { message: 'ไม่พบคำขอซ่อมที่ระบุ' });
      }

      res.render('request_mgr_view', { request: request });
    } catch (error) {
      console.error('Error in viewRequest:', error);
      res.status(500).render('error', { message: 'เกิดข้อผิดพลาดในการโหลดรายละเอียดคำขอซ่อม' });
    }
  }
};

module.exports = requestMgrController;