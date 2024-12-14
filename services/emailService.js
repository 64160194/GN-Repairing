const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // กำหนดค่า SMTP server ของคุณที่นี่
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '64160194@go.buu.ac.th',
    pass: 'ouhx kqop wmov lico'
  }
});

exports.sendNotificationEmail = async (managerEmail, request, requester) => {
  const mailOptions = {
    from: '"ระบบแจ้งซ่อม" <noreply@example.com>',
    to: managerEmail,
    subject: 'แจ้งเตือน: มีคำขอซ่อมใหม่',
    html: `
      <h2>มีคำขอซ่อมใหม่จากแผนกของคุณ</h2>
      <p><strong>ผู้แจ้งซ่อม:</strong> ${requester.f_name} ${requester.l_name}</p>
      <p><strong>แผนก:</strong> ${requester.dept_name}</p>
      <p><strong>อีเมล:</strong> ${requester.u_mail}</p>
      <p><strong>รายการแจ้งซ่อม:</strong> ${request.repair_item}</p>
      <p><strong>อาการ/ลักษณะการชำรุด:</strong> ${request.sympton_def}</p>
      <p><strong>สถานที่:</strong> ${request.location_n}</p>
      <p><strong>ประเภทการซ่อม:</strong> ${request.repair_type}</p>
      <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};