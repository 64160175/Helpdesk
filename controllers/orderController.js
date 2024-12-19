const orderModel = require('../models/orderModel');
const nodemailer = require('nodemailer');

// แสดงข้อมูลออร์เดอร์ทั้งหมดของผู้ใช้
exports.getUserHome = (req, res) => {
  const userId = req.session.user.id_user;

  orderModel.getUserOrders(userId, (err, orders) => {
    if (err) {
      console.error('Error fetching user orders:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.render('UserHome', {
      user: req.session.user,
      orders: orders
    });
  });
};

// แสดงรายละเอียดออร์เดอร์
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id_order;
  orderModel.getOrderById(orderId, (err, order) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
    if (!order) {
      return res.status(404).send('ไม่พบคำสั่งซื้อ');
    }
    orderModel.getOrderItemsByOrderId(orderId, (err, orderItems) => {
      if (err) {
        console.error('Error fetching order items:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลรายการสินค้า');
      }
      res.render('orderDetails', { order: order, orderDetails: orderItems });
    });
  });
};

// สร้างออร์เดอร์ใหม่
exports.createOrder = (req, res) => {
  const { requesterName, requesterEmail, additionalNotes, selectedItems } = req.body;
  const userId = req.session.user.id_user;

  const orderData = {
    id_user: userId,
    o_name: requesterName,
    o_email: requesterEmail,
    approve_status: null,
    reason: additionalNotes
  };

  const orderItems = selectedItems.map(item => ({
    i_brand_name: item.name,
    type: item.type,
    quantity: item.quantity
  }));

  orderModel.createOrderWithItems(orderData, orderItems, (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // ส่งอีเมลแจ้งเตือน
    sendNotificationEmail(requesterName, requesterEmail, selectedItems, additionalNotes);

    res.status(200).json({ message: 'Order created successfully', orderId: result.orderId });
  });
};

// ฟังก์ชันส่งอีเมลแจ้งเตือน
function sendNotificationEmail(requesterName, requesterEmail, selectedItems, additionalNotes) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    auth: {
      user: '64160175@go.buu.ac.th',
      pass: 'qlsy gyps ocno xnup'
    }
  });

  const mailOptions = {
    from: '"ระบบเบิกอุปกรณ์ไอที" <64160175@go.buu.ac.th>',
    to: 'masth0user1@gmail.com',
    subject: 'แจ้งเตือน: มีคำขอเบิกอุปกรณ์ใหม่',
    html: `
      <div style="font-family: 'Prompt', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <!-- หัวข้อหลัก -->
        <h2 style="color: #3a3a3a; text-align: center; border-bottom: 2px solidrgb(17, 0, 255); padding-bottom: 15px; margin-bottom: 25px;">
          มีคำขอเบิกอุปกรณ์ใหม่
        </h2>
    
        <!-- ข้อมูลผู้ขอ -->
        <div style="margin-bottom: 25px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p style="margin: 5px 0;"><strong style="color: #4a4a4a;">ชื่อผู้ขอ:</strong> ${requesterName}</p>
          <p style="margin: 5px 0;"><strong style="color: #4a4a4a;">อีเมลผู้ขอ:</strong> ${requesterEmail}</p>
        </div>
    
        <!-- รายการที่ขอเบิก -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #4a4a4a; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">รายการที่ขอเบิก:</h3>
          <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #e0e0e0; border-radius: 5px; overflow: hidden;">
            <thead>
              <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 12px; text-align: left;">ชื่อรายการ</th>
                <th style="padding: 12px; text-align: left;">ประเภท</th>
                <th style="padding: 12px; text-align: center;">จำนวน</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItems.map((item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? '#f8f8f8' : 'white'};">
                  <td style="padding: 12px; border-top: 1px solid #e0e0e0;">${item.name}</td>
                  <td style="padding: 12px; border-top: 1px solid #e0e0e0;">${item.type}</td>
                  <td style="padding: 12px; border-top: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4CAF50;">${item.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
    
        <!-- หมายเหตุเพิ่มเติม -->
        <div style="margin-bottom: 25px;">
          <h3 style="color: #4a4a4a; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">หมายเหตุเพิ่มเติม:</h3>
          <p style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${additionalNotes || 'ไม่มี'}
          </p>
        </div>
    
        <!-- ปุ่มดำเนินการ -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px; transition: background-color 0.3s;">
            กดที่นี่เพื่อดำเนินการต่อ
          </a>
        </div>
    
        <!-- ข้อความท้าย -->
        <p style="font-size: 0.9em; color: #888; text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
          อีเมลนี้เป็นอีเมลอัตโนมัติ โปรดอย่าตอบกลับ
        </p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}