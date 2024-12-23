const sharp = require('sharp');
const multer = require('multer');
const { memoryStorage } = require('multer');
const addRequestModel = require('../models/addRequestModel');
const nodemailer = require('nodemailer');

const upload = multer({ storage: memoryStorage() });

async function sendEmailNotification(managerEmail, requestDetails) {
  let transporter = nodemailer.createTransport({
    host: "your-smtp-host",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "your-email@example.com",
      pass: "your-email-password",
    },
  });

  let info = await transporter.sendMail({
    from: '"GN Repairing System" <noreply@gnrepairing.com>',
    to: managerEmail,
    subject: "มีคำขอซ่อมใหม่",
    text: `มีคำขอซ่อมใหม่เข้ามาในระบบ
รายละเอียด:
ประเภทการซ่อม: ${requestDetails.repair_type}
รายการที่ต้องซ่อม: ${requestDetails.repair_item}
อาการ/ปัญหา: ${requestDetails.sympton_def}
สถานที่: ${requestDetails.location_n}`,
    html: `<h1>มีคำขอซ่อมใหม่เข้ามาในระบบ</h1>
<p><strong>รายละเอียด:</strong></p>
<ul>
  <li>ประเภทการซ่อม: ${requestDetails.repair_type}</li>
  <li>รายการที่ต้องซ่อม: ${requestDetails.repair_item}</li>
  <li>อาการ/ปัญหา: ${requestDetails.sympton_def}</li>
  <li>สถานที่: ${requestDetails.location_n}</li>
</ul>`,
  });

  console.log("Message sent: %s", info.messageId);
}

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
      try {
        const requestData = {
          u_id: req.session.userId,
          repair_item: req.body.repairList,
          sympton_def: req.body.repairSymptoms,
          location_n: req.body.location,
          repair_type: req.body.repairType,
          other_type: req.body.repairType === 'Other (อื่น ๆ)' ? req.body.otherRepairTypeText : null,
          r_pic1: null,
          r_pic2: null,
          r_pic3: null,
          date_time: new Date()
        };

        // Validate repair_type
        const validRepairTypes = [
          'Facility (อาคารสถานที่)',
          'Utility (สาธารณูปโภค)',
          'Electrical System (ระบบไฟฟ้า)',
          'Other (อื่น ๆ)'
        ];

        if (!validRepairTypes.includes(requestData.repair_type)) {
          throw new Error('Invalid repair type');
        }

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

        // หลังจากบันทึกคำขอ ให้ดึงข้อมูลอีเมลของหัวหน้าแผนก
        const userInfo = await addRequestModel.getUserInfo(req.session.userId);
        const managerInfo = await addRequestModel.getDepartmentManager(userInfo.dept_id);

        if (managerInfo && managerInfo.email) {
          // ส่งอีเมลแจ้งเตือนไปยังหัวหน้าแผนก
          await sendEmailNotification(managerInfo.email, requestData);
        }
        
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