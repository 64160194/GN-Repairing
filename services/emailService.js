const nodemailer = require('nodemailer');

const emailService = {
  sendEmail: async (to, subject, html) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "64160194@go.buu.ac.th",
        pass: "fltv pagw ndou bjmi",
      },
    });

    let info = await transporter.sendMail({
      from: '"General Repairing System" <64160194@go.buu.ac.th>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
  },

  sendNewRequestNotification: async (user, manager, requestData) => {
    const subject = "แจ้งเตือน: มีคำขอซ่อมใหม่";
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Kanit', sans-serif; }
            .container { max-width: 600px; margin: auto; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f1f1f1; padding: 10px; text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .button { background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">แจ้งเตือน: มีคำขอซ่อมใหม่</h1>
            </div>
            <div class="content">
              <h2>ข้อมูลผู้แจ้งซ่อม</h2>
              <table>
                <tr><th>ชื่อ-นามสกุล:</th><td>${user.f_name} ${user.l_name}</td></tr>
                <tr><th>แผนก:</th><td>${user.dept_name}</td></tr>
              </table>
              
              <h2>รายละเอียดการแจ้งซ่อม</h2>
              <table>
                <tr><th>อุปกรณ์ที่ต้องการซ่อม:</th><td>${requestData.repair_item}</td></tr>
                <tr><th>อาการ:</th><td>${requestData.sympton_def}</td></tr>
                <tr><th>สถานที่:</th><td>${requestData.location_n}</td></tr>
              </table>

              <p style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:3000/" class="button">กดเพื่อดำเนินการต่อ</a>
              </p>
            </div>
            <div class="footer">
              <p>หากมีข้อสงสัยกรุณาติดต่อฝ่าย IT | © ${new Date().getFullYear()} MINIBEA ACCESSOLUTIONS THAI LTD.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    await emailService.sendEmail(manager.u_mail, subject, html);
  },


  
};

module.exports = emailService;