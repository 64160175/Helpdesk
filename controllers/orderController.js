const nodemailer = require('nodemailer');
const db = require('../db');
const OrderModel = require('../models/orderModel');

class OrderController {
  // แสดงหน้า Home ของผู้ใช้งาน โดยดึงข้อมูลคำสั่งซื้อของผู้ใช้งานที่ล็อกอินอยู่ #แสดงหน้า UserHome
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

  // ดึงรายละเอียดคำสั่งซื้อเฉพาะรายการ โดยรวมถึงรายการสินค้าที่เกี่ยวข้อง พร้อมส่งข้อมูลไปยัง template #แสดงหน้า OrderDetails
  static getOrderDetails(req, res) {
    const orderId = req.params.id_order;

    OrderModel.getOrderById(orderId, (err, order) => {
      if (err) {
        console.error('Error fetching order:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
      if (!order) {
        return res.status(404).send('ไม่พบคำสั่ง');
      }

      OrderModel.getOrderItemsByOrderId(orderId, (err, orderItems) => {
        if (err) {
          console.error('Error fetching order items:', err);
          return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลรายการสินค้า');
        }

        const sectionName = req.session.user.section_name || 'Default Section';

        res.render('orderDetails', {
          order: order,
          orderDetails: orderItems,
          sectionName: sectionName,
          user: req.session.user
        });
      });
    });
  }



  // สร้างคำสั่งซื้อใหม่จากข้อมูลที่ผู้ใช้กรอก พร้อมส่งอีเมลแจ้งเตือน และตอบกลับเมื่อสร้างสำเร็จ #แสดงหน้า UserRequest
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
  // ส่งอีเมลแจ้งเตือนถึงผู้จัดการแผนกเมื่อมีการสร้างคำขอเบิกใหม่   User-->Manager
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


  // แสดงรายการคำขอเบิกอุปกรณ์ทั้งหมดของแผนกที่ผู้จัดการดูแล พร้อมข้อมูลผู้ใช้และแผนก #แสดงหน้า ManagerRequestList
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


        res.render('ManagerRequestList', {
          user: req.session.user,
          sectionName: sectionName,
          orders: orders
        });
      });
    });
  }

  // ดึงข้อมูลคำขอทั้งหมดของแผนกที่ผู้จัดการดูแล พร้อมข้อมูลผู้ใช้และแผนก #แสดงหน้า ManagerRequestList
  static approveRequestByManager(req, res) {
    const orderId = req.body.orderId;
    const action = req.body.action;
    let approveStatus;

    if (action === 'approve') {
      approveStatus = 'mgr_approve';
    } else if (action === 'deny') {
      approveStatus = 'mgr_deny';
    } else {
      return res.status(400).send('Invalid action');
    }

    OrderModel.updateOrderStatus(orderId, approveStatus, (err, results) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).send('Internal Server Error');
      }
      OrderController.handleRequestApproval(req, res);
    });
  }

  // การจัดการการอนุมัติคำขอของผู้จัดการ #แสดงหน้า ManagerRequestList
  static handleRequestApproval(req, res) {
    const { orderId, action } = req.body;
  
    const query = `
      SELECT o.o_name, o.o_email, o.approve_status, oi.i_brand_name, oi.type, oi.quantity, u.id_emp_section, es.section
      FROM tbl_order o
      JOIN tbl_order_item oi ON o.id_order = oi.id_order
      JOIN tbl_user u ON o.id_user = u.id_user
      JOIN tbl_emp_section es ON u.id_emp_section = es.id_emp_section
      WHERE o.id_order = ?
    `;
  
    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error retrieving order details:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      if (results.length === 0) {
        return res.status(404).send('Order not found');
      }
  
      const orderDetails = results;
      const requesterEmail = orderDetails[0].o_email;
      const requesterName = orderDetails[0].o_name;
      const requesterDepartment = orderDetails[0].section;
  
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '64160175@go.buu.ac.th',
          pass: 'qlsy gyps ocno xnup',
        },
      });
      // ส่งอีเมลแจ้งเตือนถึงผู้ขอเมื่อคำขอถูกอนุมัติหรือปฏิเสธ 
      let mailOptions;
      if (action === 'approve') {
        mailOptions = {
          from: '"ระบบเบิกอุปกรณ์ไอที" <64160175@go.buu.ac.th>',
          to: '64160175@go.buu.ac.th', // Admin email address
          subject: 'แจ้งเตือน: คำขอเบิกอุปกรณ์ได้รับการอนุมัติจากผู้จัดการ',
          html: `
            <table style="font-family: 'Prompt', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-collapse: separate; border-spacing: 0; border: 2px solid #0056b3; border-radius: 12px; overflow: hidden;">
              <tr>
                <td>
                  <table style="width: 100%; border-collapse: collapse; border: 1px solid #0056b3; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 20px; background: linear-gradient(135deg, #0056b3, #007bff); text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">แจ้งเตือนการอนุมัติคำขอเบิกอุปกรณ์</h1>
                      </td>
                    </tr>
                    <tr>
                    <td style="padding: 20px; background-color: #f8f9fa; font-size: 16px; color: #333;">
                      <p>
                        คำขอเบิกอุปกรณ์จาก <strong>${requesterName}</strong>
                      </p>
                      <p>แผนก: <strong>${requesterDepartment}</strong></p>
                      <p>อีเมล: <strong>${requesterEmail}</strong></p>
                      <p>ได้รับการอนุมัติจากผู้จัดการแล้ว</p>
                    </td>
                    
                    </tr>
                    <tr>
                      <td style="padding: 20px; background-color: #f8f9fa;">
                        <h3 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">รายละเอียดคำขอ:</h3>
                        <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #f8f9fa; border-radius: 8px; overflow: hidden;">
                          <thead>
                            <tr style="background: linear-gradient(135deg, #0056b3, #007bff);">
                              <th style="padding: 12px; color: white; text-align: left;">อุปกรณ์</th>
                              <th style="padding: 12px; color: white; text-align: left;">ประเภท/สี</th>
                              <th style="padding: 12px; color: white; text-align: center;">จำนวน</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${orderDetails.map((item, index) => `
                              <tr style="background-color: ${index % 2 === 0 ? '#fffffa' : '#ffffff'};">
                                <td style="padding: 12px; border-top: 1px solid #dee2e6;">${item.i_brand_name}</td>
                                <td style="padding: 12px; border-top: 1px solid #dee2e6;">${item.type}</td>
                                <td style="padding: 12px; border-top: 1px solid #dee2e6; text-align: center;">${item.quantity} ชิ้น</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                        <p style="font-size: 16px; color: #333; margin-top: 20px;">กรุณาดำเนินการจัดเตรียมอุปกรณ์ตามรายการข้างต้น</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; text-align: center; background-color: #f8f9fa;">
                        <a href="http://localhost:3000" style="font-size: 16px; display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">ดูรายการคำขอทั้งหมด</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 18px; text-align: center; background-color: #0056b3; color: #ffffff; font-size: 14px;">
                        อีเมลนี้เป็นการแจ้งเตือนอัตโนมัติ กรุณาอย่าตอบกลับ<br>
                        หากมีข้อสงสัย กรุณาติดต่อแผนก IT
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `,
        };
      } else if (action === 'deny') {
        mailOptions = {
          from: '"ระบบเบิกอุปกรณ์ไอที" <64160175@go.buu.ac.th>',
          to: requesterEmail,
          subject: 'แจ้งเตือน: คำขอเบิกอุปกรณ์ถูกปฏิเสธ',
          html: `
            <table style="font-family: 'Prompt', Arial, sans-serif; width: 100%; max-width: 600px; margin: 0 auto; border-collapse: separate; border-spacing: 0; border: 2px solid #dc3545; border-radius: 12px; overflow: hidden;">
              <tr>
                <td>
                  <table style="width: 100%; border-collapse: collapse; border: 1px solid #dc3545; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 20px; background: linear-gradient(135deg, #dc3545,rgb(255, 104, 116)); text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">แจ้งเตือน: คำขอเบิกอุปกรณ์ถูกปฏิเสธ</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; background-color: #fff; font-size: 16px; color: #333;">
                        <p>เรียน คุณ${requesterName},</p>
                        <p>คำขอเบิกอุปกรณ์ของคุณได้ถูกปฏิเสธ</p>
                        <p>รายละเอียด:</p>
                        <ul>
                          <li>ชื่อผู้ขอ: <strong>${requesterName}</strong></li>
                          <li>แผนก: <strong>${requesterDepartment}</strong></li>
                          <li>อีเมล: <strong>${requesterEmail}</strong></li>
                        </ul>
                        <p>หากคุณมีข้อสงสัยเกี่ยวกับการปฏิเสธนี้ กรุณาติดต่อผู้จัดการของคุณหรือแผนก IT เพื่อขอข้อมูลเพิ่มเติม</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px; background-color: #f8f9fa;">
                        <h3 style="color: #dc3545; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">รายการอุปกรณ์ที่ขอเบิก:</h3>
                        <table style="width: 100%; border-collapse: separate; border-spacing: 0; border: 1px solid #f8f9fa; border-radius: 8px; overflow: hidden;">
                          <thead>
                            <tr style="background: linear-gradient(135deg, #dc3545, rgb(255, 104, 116));">
                              <th style="padding: 12px; color: white; text-align: left;">อุปกรณ์</th>
                              <th style="padding: 12px; color: white; text-align: left;">ประเภท/สี</th>
                              <th style="padding: 12px; color: white; text-align: center;">จำนวน</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${orderDetails.map((item, index) => `
                              <tr style="background-color: ${index % 2 === 0 ? '#fff5f5' : '#ffffff'};">
                                <td style="padding: 12px; border-top: 1px solid #dee2e6;">${item.i_brand_name}</td>
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
                        <a href="http://localhost:3000" style="font-size: 16px; display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s;">ดูรายละเอียดคำขอ</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 18px; text-align: center; background-color: #dc3545; color: #ffffff; font-size: 14px;">
                        อีเมลนี้เป็นการแจ้งเตือนอัตโนมัติ กรุณาอย่าตอบกลับ 
                        หากมีข้อสงสัย กรุณาติดต่อแผนก IT
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          `,
        };
      } else {
        return res.status(400).send('Invalid action');
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send('Error sending email');
        } else {
          console.log('Email sent:', info.response);
          res.redirect('/ManagerRequestList');
        }
      });
    });
  }




}

module.exports = OrderController;