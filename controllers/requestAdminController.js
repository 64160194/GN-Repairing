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
  
      const workerInfo = await RequestAdminModel.getWorkerInfoByRequestId(requestId);
      request.worker = workerInfo;
  
      // ตรวจสอบว่า worker_status มีอยู่ใน request หรือไม่
      if (!request.worker_status && workerInfo && workerInfo.worker_status) {
        request.worker_status = workerInfo.worker_status;
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
        finish_time,
        edit_by,
        budget_by
      } = req.body;
  
      const updateData = {
        survey_results,
        work_cause,
        edit_details,
        date_by,
        finish_time,
        edit_by,
        budget_by
      };
  
      Object.keys(updateData).forEach(key => 
        (updateData[key] === undefined || updateData[key] === '') && delete updateData[key]
      );
  
      if (updateData.date_by) {
        if (updateData.date_by.trim() === '') {
          updateData.date_by = null;
        } else {
          const finishDate = new Date(updateData.date_by);
          if (!isNaN(finishDate.getTime())) {
            updateData.date_by = finishDate.toISOString().split('T')[0];
          } else {
            console.error('Invalid date_by format:', updateData.date_by);
            updateData.date_by = null;
          }
        }
      }
  
      if (finish_time !== undefined) {
        if (finish_time.trim() === '') {
          updateData.finish_time = null;
        } else {
          // ตรวจสอบว่าเป็นตัวเลขหรือไม่
          if (!isNaN(finish_time)) {
            // ถ้าเป็นตัวเลข ให้ใช้ค่านั้นเลย (เป็นนาที)
            updateData.finish_time = parseInt(finish_time, 10);
          } else {
            // ถ้าไม่ใช่ตัวเลข ให้พยายามแปลงเป็นนาทีจากรูปแบบ HH:MM
            const timeParts = finish_time.split(':');
            if (timeParts.length === 2) {
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              if (!isNaN(hours) && !isNaN(minutes)) {
                updateData.finish_time = hours * 60 + minutes;
              } else {
                console.error('Invalid finish_time format:', finish_time);
                updateData.finish_time = null;
              }
            } else {
              console.error('Invalid finish_time format:', finish_time);
              updateData.finish_time = null;
            }
          }
        }
      }
  
      console.log('Update data:', updateData);
  
      await RequestAdminModel.beginTransaction();
  
      try {
        const result = await RequestAdminModel.updateRequest(req_id, updateData);
  
        if (result) {
          await RequestAdminModel.updateWorkerStatus(req_id, 1);
          await RequestAdminModel.commitTransaction();
          res.json({ success: true, message: 'Request updated successfully and worker status changed' });
        } else {
          await RequestAdminModel.rollbackTransaction();
          res.status(404).json({ success: false, message: 'Request not found or update failed' });
        }
      } catch (error) {
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