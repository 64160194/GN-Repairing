const requestMgrAdminModel = require('../models/requestMgrAdminModel');

const requestMgrAdminController = {
    showRequestMgrAdminPage: async (req, res) => {
        try {
            const requests = await requestMgrAdminModel.getAllApprovedRequests();
            res.render('request_mgradmin', { requests });
        } catch (error) {
            console.error('Error fetching requests:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    viewRequest: async (req, res) => {
        try {
            const requestId = req.params.id;
            const request = await requestMgrAdminModel.getRequestById(requestId);
            if (!request) {
                return res.status(404).send('Request not found');
            }
            res.render('request_mgradmin_view', { request });
        } catch (error) {
            console.error('Error fetching request details:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    handleRequest: async (req, res) => {
        try {
          const { req_id, action } = req.body;
          const status = action === 'approve' ? 'approve' : 'reject';
          
          const result = await requestMgrAdminModel.updateApprovalStatus(req_id, status);
          
          if (result) {
            res.json({ success: true, message: `Request ${status}d successfully` });
          } else {
            res.json({ success: false, message: 'Failed to update request status' });
          }
        } catch (error) {
          console.error('Error handling request:', error);
          res.status(500).json({ success: false, message: 'An error occurred while processing the request' });
        }
      },

      
    approveRequest: async (req, res) => {
        try {
            const reqId = req.params.id;
            const result = await requestMgrAdminModel.updateApprovalStatus(reqId, 'approve');
            if (result) {
                res.json({ success: true });
            } else {
                res.status(400).json({ success: false, error: 'Failed to approve request' });
            }
        } catch (error) {
            console.error('Error in approveRequest:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },

    rejectRequest: async (req, res) => {
        try {
            const reqId = req.params.id;
            const result = await requestMgrAdminModel.updateApprovalStatus(reqId, 'reject');
            if (result) {
                res.json({ success: true });
            } else {
                res.status(400).json({ success: false, error: 'Failed to reject request' });
            }
        } catch (error) {
            console.error('Error in rejectRequest:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }

};

module.exports = requestMgrAdminController;