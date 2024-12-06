const RequestMgrAdminModel = require('../models/requestMgrAdminModel');

const requestMgrAdminController = {
  showRequestMgrAdminPage: async (req, res) => {
    try {
      const requests = await RequestMgrAdminModel.getAllRequests();
      res.render('request_mgradmin', { 
        title: 'Request Manager Admin',
        requests: requests,
        user: req.user // Pass user data to the view
      });
    } catch (error) {
      console.error('Error in showRequestMgrAdminPage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request manager admin page.' });
    }
  },

  // Add more controller methods as needed
};

module.exports = requestMgrAdminController;