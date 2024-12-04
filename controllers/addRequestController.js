const sharp = require('sharp');
const multer = require('multer');
const { memoryStorage } = require('multer');
const addRequestModel = require('../models/addRequestModel');

// Use memory storage for multer
const upload = multer({ storage: memoryStorage() });

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
        const requestData = {
          u_id: req.session.userId,
          repair_item: req.body.repairList,
          sympton_def: req.body.repairSymptoms,
          location_n: req.body.location,
          repair_type: req.body.repairType,
          other_type: req.body.repairType === 'other' ? req.body.otherRepairTypeText : null,
          r_pic1: null,
          r_pic2: null,
          r_pic3: null,
          date_time: new Date()
        };

        const processImage = async (image) => {
          if (image) {
            const { buffer, mimetype } = image[0];
            try {
              const resizedBuffer = await sharp(buffer)
                .resize(900, null, { 
                  fit: 'inside',
                  withoutEnlargement: true
                })
                .jpeg({ quality: 80 })
                .toBuffer();
              return resizedBuffer;
            } catch (error) {
              console.log('เกิดข้อผิดพลาดขณะบีบอัดรูปภาพ', error);
              return null;
            }
          }
          return null;
        };

        requestData.r_pic1 = await processImage(req.files['image1']);
        requestData.r_pic2 = await processImage(req.files['image2']);
        requestData.r_pic3 = await processImage(req.files['image3']);

        const newRequestId = await addRequestModel.addRequest(requestData);

        req.session.flash = { success: 'ได้ทำการบันทึกคำร้องขอแจ้งซ่อมของคุณแล้ว !' };
        res.redirect('/user_home');
      } catch (error) {
        console.error('ไม่สามารถทำการบันทึกคำร้องขอแจ้งซ่อมของคุณได้', error);
        req.session.flash = { error: 'An error occurred while submitting the request' };
        res.redirect('/add_request');
      }
    }
  ]
};

module.exports = addRequestController;