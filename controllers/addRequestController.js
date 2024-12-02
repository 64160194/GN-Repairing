const addRequestModel = require('../models/addRequestModel');
const multer = require('multer');
const { memoryStorage } = require('multer');
const sharp = require('sharp');

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
        console.log('Form data:', req.body);
        console.log('Files:', req.files);

        const requestData = {
          u_id: req.session.userId,
          repair_item: req.body.repairList,
          sympton_def: req.body.repairSymptoms,
          location_n: req.body.location,
          repair_type: req.body.repairType,
          other_type: req.body.repairType === 'other' ? req.body.otherRepairTypeText : null,
          r_pic1: req.files['image1'] ? req.files['image1'][0].buffer : null,
          r_pic2: req.files['image2'] ? req.files['image2'][0].buffer : null,
          r_pic3: req.files['image3'] ? req.files['image3'][0].buffer : null,
          date_time: new Date()
        };
        const processImage = async (image) => {
          if (image) {
            const {buffer, mimetype} = image[0];
              try {
  
                const resizedBuffer = await sharp(buffer)
                .resize(800, null, { // กำหนดขนาดความกว้างสูงสุด 800px, คำนวณความสูงอัตโนมัติ
                  fit: 'inside',
                  withoutEnlargement: true // ไม่ขยายรูปภาพให้ใหญ่ขึ้นหากขนาดเล็กกว่า 800px อยู่แล้ว
                })
                .jpeg({ quality: 80 }) // แปลงเป็น JPEG คุณภาพ 80 (ปรับค่าได้ตามต้องการ)
                .toBuffer();
                  return resizedBuffer; // ส่งคืน buffer รูปภาพที่ถูกบีบอัดแล้ว
              } catch (error) {
                console.log('เกิดข้อผิดพลาดขณะบีบอัดรูปภาพ', error)
                return null
              }
            }
             return null; // ไม่มีรูปภาพให้ประมวลผล
         };
  
          requestData.r_pic1 = await processImage(req.files['image1']);
          requestData.r_pic2 = await processImage(req.files['image2']);
          requestData.r_pic3 = await processImage(req.files['image3']);
  
  
  
        console.log('Request data to be saved:', requestData);
        const newRequestId = await addRequestModel.addRequest(requestData);
        
        console.log('New request added with ID:', newRequestId);

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