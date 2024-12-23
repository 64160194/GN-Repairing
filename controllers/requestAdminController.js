const RequestAdminModel = require('../models/requestAdminModel');

const requestAdminController = {
  showRequestAdmin: async (req, res) => {
    try {
      const requests = await RequestAdminModel.getApprovedRequests();
      res.render('request_admin', { requests, user: req.user });
    } catch (error) {
      console.error('Error in showRequestAdmin:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request admin page.', error: error.message });
    }
  },

  viewRequest: async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await RequestAdminModel.getRequestById(requestId);
      
      if (!request) {
        return res.status(404).render('error', { message: 'Request not found.' });
      }

      // Check if the request is approved by both manager and HR/GA
      if (request.app_mgr !== 'approve' || request.app_hrga !== 'approve') {
        return res.status(403).render('error', { message: 'This request has not been fully approved yet.' });
      }

      res.render('request_admin_view', { request, user: req.user });
    } catch (error) {
      console.error('Error in viewRequest:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request details.', error: error.message });
    }
  },

  updateRequest: async (req, res) => {
    try {
      const {
        req_id,
        survey_results,
        work_cause,
        edit_details,
        date_by,
        time_taken,
        edit_by,
        budget_by
      } = req.body;
  
      // สร้าง object สำหรับข้อมูลที่จะอัปเดต
      const updateData = {
        survey_results,
        work_cause,
        edit_details,
        date_by,
        time_taken,
        edit_by,
        budget_by
      };
  
      // กรองเอาเฉพาะข้อมูลที่มีค่า
      Object.keys(updateData).forEach(key => 
        (updateData[key] === undefined || updateData[key] === '') && delete updateData[key]
      );
  
      // เริ่ม transaction
      await RequestAdminModel.beginTransaction();
  
      try {
        // อัปเดตข้อมูลในตาราง requests
        const result = await RequestAdminModel.updateRequest(req_id, updateData);
  
        if (result) {
          // อัปเดต worker_status ในตาราง tbl_worker
          await RequestAdminModel.updateWorkerStatus(req_id, 1);
  
          // Commit transaction
          await RequestAdminModel.commitTransaction();
  
          res.json({ success: true, message: 'Request updated successfully and worker status changed' });
        } else {
          // Rollback transaction ถ้าไม่สามารถอัปเดต request ได้
          await RequestAdminModel.rollbackTransaction();
          res.status(404).json({ success: false, message: 'Request not found or update failed' });
        }
      } catch (error) {
        // Rollback transaction ถ้าเกิดข้อผิดพลาดระหว่างการอัปเดต
        await RequestAdminModel.rollbackTransaction();
        throw error;
      }
    } catch (error) {
      console.error('Error in updateRequest:', error);
      res.status(500).json({ success: false, message: 'An error occurred while updating the request', error: error.message });
    }
  }
  
};

module.exports = requestAdminController;