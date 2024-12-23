const nodemailer = require('nodemailer');
const db = require('../db');
const OrderModel = require('../models/orderModel');

class OrderController {
  static getUserHome(req, res) {
    const userId = req.session.user.id_user;

    OrderModel.getUserOrders(userId, (err, orders) => {
      if (err) {
        console.error('Error fetching user orders:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('UserHome', {
        user: req.session.user,
        orders: orders,
      });
    });
  }

  static getOrderDetails(req, res) {
    const orderId = req.params.id_order;

    OrderModel.getOrderById(orderId, (err, order) => {
      if (err) {
        console.error('Error fetching order:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
      if (!order) {
        return res.status(404).send('ไม่พบคำสั่งซื้อ');
      }

      OrderModel.getOrderItemsByOrderId(orderId, (err, orderItems) => {
        if (err) {
          console.error('Error fetching order items:', err);
          return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลรายการสินค้า');
        }

        res.render('orderDetails', { order: order, orderDetails: orderItems });
      });
    });
  }

  static createOrder(req, res) {
    const { requesterName, requesterEmail, additionalNotes, selectedItems } = req.body;
    const userId = req.session.user.id_user;

    const orderData = {
      id_user: userId,
      o_name: requesterName,
      o_email: requesterEmail,
      approve_status: null,
      reason: additionalNotes,
    };

    const orderItems = selectedItems.map((item) => ({
      i_brand_name: item.name,
      type: item.type,
      quantity: item.quantity,
    }));

    OrderModel.createOrderWithItems(orderData, orderItems, (err, result) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      OrderController.sendNotificationEmail(requesterName, requesterEmail, selectedItems, additionalNotes, userId);

      res.status(200).json({ message: 'Order created successfullyจ้าาาาาาาาา', orderId: result.orderId });
    });
  }

  static sendNotificationEmail(requesterName, requesterEmail, selectedItems, additionalNotes, userId) {
    const query = `
      SELECT u.id_emp_section, m.email as manager_email, es.section as department_name
      FROM tbl_user u
      JOIN tbl_user m ON u.id_emp_section = m.id_emp_section
      JOIN tbl_emp_section es ON u.id_emp_section = es.id_emp_section
      WHERE u.id_user = ? AND m.u_type = 'manager'
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching manager email and department:', err);
        return;
      }

      if (results.length === 0) {
        console.error('No manager found for the user');
        return;
      }

      const managerEmail = results[0].manager_email;
      const departmentName = results[0].department_name;
      const currentDate = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '64160175@go.buu.ac.th',
          pass: 'qlsy gyps ocno xnup',
        },
      });

      const mailOptions = {
        from: '"ระบบเบิกอุปกรณ์ไอที" <64160175@go.buu.ac.th>',
        to: managerEmail,
        subject: 'แจ้งเตือน: มีคำขอเบิกอุปกรณ์ใหม่',
        html: `
          <table style="font-family: 'Prompt', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-collapse: separate; border-spacing: 0; border: 2px solid #0056b3; border-radius: 12px; overflow: hidden;">
            <tr>
              <td>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #0056b3; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 20px; background: linear-gradient(135deg, #0056b3, #007bff); text-align: center;">
                      <h1 style="color: #ffffff; margin: 0;">มีคำขอเบิกอุปกรณ์ใหม่</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; background-color: #f8f9fa;">
                      <p style="font-size: 16px; color: #333;"><strong>ชื่อผู้ขอ:</strong> ${requesterName}</p>
                      <p style="font-size: 16px; color: #333;"><strong>แผนก:</strong> ${departmentName}</p>
                      <p style="font-size: 16px; color: #333;"><strong>อีเมลผู้ขอ:</strong> ${requesterEmail}</p>
                      <p style="font-size: 16px; color: #333;"><strong>ขอเมื่อวันที่:</strong> ${currentDate}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; background-color: #f8f9fa;">
                      <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">รายการที่ขอเบิก</h3>
                      <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #f8f9fa; border-radius: 8px; overflow: hidden;">
                        <thead>
                          <tr style="background: linear-gradient(135deg, #0056b3, #007bff);">
                            <th style="padding: 12px; color: white; text-align: left;">ชื่อรายการ</th>
                            <th style="padding: 12px; color: white; text-align: left;">สี/ประเภท</th>
                            <th style="padding: 12px; color: white; text-align: center;">จำนวน</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${selectedItems.map((item, index) => `
                            <tr style="background-color: ${index % 2 === 0 ? '#fffffa' : '#ffffff'};">
                              <td style="padding: 12px; border-top: 1px solid #dee2e6;">${item.name}</td>
                              <td style="padding: 12px; border-top: 1px solid #dee2e6;">${item.type}</td>
                              <td style="padding: 12px; border-top: 1px solid #dee2e6; text-align: center;">${item.quantity} ชิ้น</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px; text-align: center; background-color: #f8f9fa;">
                      <a href="http://localhost:3000" style="font-size: 16px; display: inline-block; padding: 12px 24px; background-color:rgb(6, 139, 2); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">กดที่นี่เพื่อดำเนินการต่อ</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 18px; text-align: center; background-color: #0056b3; color: #ffffff; font-size: 14px;">
                      อีเมลนี้เป็นอีเมลอัตโนมัติ โปรดอย่าตอบกลับ <br> หากมีข้อสงสัย กรุณาติดต่อแผนก IT
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    });
  }


   //MGR แสดง request ทั้งหมด
   static getManagerRequestList(req, res) {
    const managerId = req.session.user.id_user;
    const managerSectionId = req.session.user.id_emp_section;
  
    // ดึงข้อมูลแผนกของผู้ใช้
    const sectionQuery = 'SELECT section FROM tbl_emp_section WHERE id_emp_section = ?';
    db.query(sectionQuery, [managerSectionId], (err, sectionResults) => {
      if (err) {
        console.error('Error fetching section:', err);
        return res.status(500).send('Internal Server Error');
      }
      const sectionName = sectionResults[0] ? sectionResults[0].section : 'ไม่ระบุ';
  
      // ดึงข้อมูลคำขอ
      OrderModel.getOrdersByManagerSection(managerSectionId, (err, orders) => {
        if (err) {
          console.error('Error fetching manager orders:', err);
          return res.status(500).send('Internal Server Error');
        }
    
        console.log('orders:', JSON.stringify(orders, null, 2)); // เพิ่มบรรทัดนี้
    
        res.render('ManagerRequestList', {
          user: req.session.user,
          sectionName: sectionName,
          orders: orders
        });
      });
    });
  }

}

module.exports = OrderController;