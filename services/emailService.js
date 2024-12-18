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
    const subject = "แจ้งเตือน: มีใบแจ้งซ่อมทั่วไปจากพนักงานในแผนก";
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Kanit', sans-serif; }
            .container { max-width: 600px; margin: auto; }
            .header { background-color: #0550a9; color: white; padding: 20px; text-align: center; }
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
              <h1 style="margin: 0;">แจ้งเตือน: มีใบแจ้งซ่อมทั่วไปจากพนักงานในแผนก</h1>
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
                <a href="http://localhost:3000/" class="button" style="color: white; text-decoration: none;"> กดเข้าสู่ระบบเพื่อดำเนินการต่อ </a>
              </p>
            </div>
            <div class="footer">
              <p>หากมีข้อสงสัยกรุณาติดต่อแผนก HR&GA | © ${new Date().getFullYear()} MINIBEA ACCESSOLUTIONS THAI LTD.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    await emailService.sendEmail(manager.u_mail, subject, html);
  },

  sendApprovalNotificationToHRGA: async (request, approver, hrgaManager) => {
    const subject = "แจ้งเตือน: มีใบแจ้งซ่อมทั่วไปได้รับการอนุมัติจากหัวหน้าแผนก";
    const html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Kanit', sans-serif; }
            .container { max-width: 600px; margin: auto; }
            .header { background-color: #0550a9; color: white; padding: 20px; text-align: center; }
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
              <h1 style="margin: 0;">แจ้งเตือน: มีใบแจ้งซ่อมทั่วไปจากแผนก ${request.dept_name}</h1>
            </div>
            <div class="content">
              <tr><th>มีคำขอร้องแจ้งซ่อมที่ได้รับการ Approve แล้วจากแผนก ${request.dept_name} </tr></th>
              <h2>ข้อมูลผู้แจ้งซ่อม</h2>
               <table>
                <tr><th>เลขที่คำขอ:</th><td>${request.req_id}</td></tr>
                <tr><th>ผู้แจ้งซ่อม:</th><td>${request.f_name} ${request.l_name}</td></tr>
                <tr><th>แผนก:</th><td>${request.dept_name}</td></tr>
              </table>
              <h2>รายละเอียดคำขอซ่อม</h2>
              <table>
                <tr><th>อุปกรณ์ที่ต้องการซ่อม:</th><td>${request.repair_item}</td></tr>
                <tr><th>อาการ:</th><td>${request.sympton_def}</td></tr>
                <tr><th>สถานที่:</th><td>${request.location_n}</td></tr>
              </table>
              <h2>ข้อมูลการอนุมัติ</h2>
              <table>
                <tr><th>ผู้อนุมัติ:</th><td>${approver.f_name} ${approver.l_name}</td></tr>
                <tr><th>ตำแหน่ง:</th><td>หัวหน้าแผนก ${approver.dept_name}</td></tr>
                <tr><th>วันที่อนุมัติ:</th><td>${new Date().toLocaleString('th-TH')}</td></tr>
              </table>

              <p style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:3000/" class="button" style="color: white; text-decoration: none;"> กดเข้าสู่ระบบเพื่อดำเนินการต่อ</a>
              </p>
            </div>
            <div class="footer">
              <p>หากมีข้อสงสัยกรุณาติดต่อแผนก HR&GA | © ${new Date().getFullYear()} MINIBEA ACCESSOLUTIONS THAI LTD.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    if (hrgaManager && hrgaManager.u_mail) {
      await emailService.sendEmail(hrgaManager.u_mail, subject, html);
    } else {
      console.log('HRGA Manager email not found. Skipping email notification.');
    }
  },

  sendApprovalNotificationToAdmin: async (request, approver, admin) => {
    const subject = "แจ้งเตือน: มีใบแจ้งซ่อมทั่วไปได้รับการอนุมัติจาก HR&GA Manager";
    const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Kanit', sans-serif; }
          .container { max-width: 600px; margin: auto; }
          .header { background-color: #0550a9; color: white; padding: 20px; text-align: center; }
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
            <h1 style="margin: 0;">แจ้งเตือน: คำขอซ่อมได้รับการอนุมัติจาก HRGA Manager</h1>
          </div>
          <div class="content">
            <h2>รายละเอียดคำขอซ่อม</h2>
            <table>
              <tr><th>เลขที่คำขอ:</th><td>${request.req_id}</td></tr>
              <tr><th>ผู้แจ้งซ่อม:</th><td>${request.f_name} ${request.l_name}</td></tr>
              <tr><th>แผนก:</th><td>${request.dept_name}</td></tr>
              <tr><th>อุปกรณ์ที่ต้องการซ่อม:</th><td>${request.repair_item}</td></tr>
              <tr><th>อาการ:</th><td>${request.sympton_def}</td></tr>
              <tr><th>สถานที่:</th><td>${request.location_n}</td></tr>
            </table>
            
            <h2>ข้อมูลการอนุมัติ</h2>
            <table>
              <tr><th>ผู้อนุมัติ:</th><td>${approver.f_name} ${approver.l_name}</td></tr>
              <tr><th>ตำแหน่ง:</th><td>HRGA Manager</td></tr>
              <tr><th>วันที่อนุมัติ:</th><td>${new Date().toLocaleString('th-TH')}</td></tr>
            </table>

            <p style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/" class="button" style="color: white; text-decoration: none;">กดเข้าสู่ระบบเพื่อดำเนินการต่อ</a>
            </p>
          </div>
          <div class="footer">
            <p>หากมีข้อสงสัยกรุณาติดต่อแผนก HR&GA | © ${new Date().getFullYear()} MINIBEA ACCESSOLUTIONS THAI LTD.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    if (admin && admin.u_mail) {
      await emailService.sendEmail(admin.u_mail, subject, html);
    } else {
      console.log('Admin email not found. Skipping email notification.');
    }
  },

};

module.exports = emailService;