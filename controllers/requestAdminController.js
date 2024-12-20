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
  }
};

module.exports = requestAdminController;