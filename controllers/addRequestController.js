const addRequestModel = require('../models/addRequestModel');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const addRequestController = {
  showAddRequestPage: async (req, res) => {
    try {
      const userInfo = await addRequestModel.getUserInfo(req.session.userId);
      res.render('add_request', { userInfo });
    } catch (error) {
      console.error('Error showing add request page:', error);
      res.status(500).send('An error occurred while loading the add request page');
    }
  },

  processAddRequest: [
    upload.fields([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
      { name: 'image3', maxCount: 1 }
    ]),
    async (req, res) => {
      console.log('processAddRequest function called');
      try {
        console.log('Form data:', req.body);
        console.log('Files:', req.files);

        const requestData = {
          u_id: req.session.userId,
          repair_item: req.body.repairList,
          sympton_def: req.body.repairSymptoms,
          location_n: req.body.location,
          repair_type: req.body.repairType,
          other_type: req.body.repairType === 'other' ? req.body.otherRepairTypeText : null,
          r_pic1: req.files['image1'] ? req.files['image1'][0].filename : null,
          r_pic2: req.files['image2'] ? req.files['image2'][0].filename : null,
          r_pic3: req.files['image3'] ? req.files['image3'][0].filename : null,
          date_time: new Date()
        };

        console.log('Request data to be saved:', requestData);

        const newRequestId = await addRequestModel.addRequest(requestData);
        console.log('New request added with ID:', newRequestId);

        req.session.flash = { success: 'Your request has been submitted successfully!' };
        res.redirect('/user_home');
      } catch (error) {
        console.error('Error submitting request:', error);
        req.session.flash = { error: 'An error occurred while submitting the request' };
        res.redirect('/add_request');
      }
    }
  ]
};

module.exports = addRequestController;