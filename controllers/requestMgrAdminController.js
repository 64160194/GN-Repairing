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
            const { req_id, action, comment } = req.body;
            const result = await requestMgrAdminModel.updateRequestStatus(req_id, action, comment);
            if (result) {
                res.redirect('/request_mgradmin');
            } else {
                res.status(400).send('Failed to update request');
            }
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = requestMgrAdminController;