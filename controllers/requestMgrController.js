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
      const mgr_id = req.session.userId;
      const role_id = req.session.roleId;
  
      let role;
      switch (role_id) {
        case 4: // สมมติว่า role_id 4 คือ manager
          role = 'mgr';
          break;
        case 2: // สมมติว่า role_id 5 คือ HRGA
          role = 'hrga';
          break;
        case 1: // สมมติว่า role_id 6 คือ admin
          role = 'admin';
          break;
        default:
          return res.status(403).json({ success: false, message: 'คุณไม่มีสิทธิ์ในการดำเนินการนี้' });
      }
  
      // บันทึกข้อมูลลงในตาราง tbl_approve
      const approve_id = await RequestMgrModel.saveApproval(req_id, mgr_id, is_approved, role);
  
      if (approve_id) {
        // อัพเดทสถานะของคำขอ
        const status = is_approved ? 'approved' : 'rejected';
        await RequestMgrModel.updateRequestStatus(req_id, approve_id, status);
  
        res.json({ success: true, message: is_approved ? 'อนุมัติคำขอเรียบร้อยแล้ว' : 'ปฏิเสธคำขอเรียบร้อยแล้ว' });
      } else {
        res.json({ success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
      }
    } catch (error) {
      console.error('Error in handleRequest:', error);
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' });
    }
  },
};

module.exports = requestMgrController;