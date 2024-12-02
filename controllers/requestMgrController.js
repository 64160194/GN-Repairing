const RequestMgrModel = require('../models/requestMgrModel');

const requestMgrController = {
  showRequestMgrPage: async (req, res) => {
    try {
      const requests = await RequestMgrModel.getAllRequests();
      res.render('request_mgr', { 
        title: 'Request Manager',
        requests: requests,
        user: req.user // Pass user data to the view
      });
    } catch (error) {
      console.error('Error in showRequestMgrPage:', error);
      res.status(500).render('error', { message: 'An error occurred while loading the request manager page.' });
    }
  }
};

module.exports = requestMgrController;