const express = require('express');
const router = express.Router();
const db = require('../db');
const WarehouseModel = require('../models/warehouseModel');
const orderController = require('../controllers/orderController');
const OrderModel = require('../models/orderModel'); // เพิ่มการ import OrderModel


const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

const checkUserType = (type) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.u_type === type) {
      next();
    } else {
      res.status(403).render('403');
    }
  };
};

router.get('/UserHome', isLoggedIn, checkUserType('user'), (req, res) => {
  // ดึงข้อมูลแผนกของผู้ใช้
  const query = 'SELECT section FROM tbl_emp_section WHERE id_emp_section = ?';
  db.query(query, [req.session.user.id_emp_section], (err, results) => {
    if (err) {
      console.error('Error fetching section:', err);
      return res.status(500).send('Internal Server Error');
    }
    const sectionName = results[0] ? results[0].section : 'ไม่ระบุ';

    // ดึงข้อมูลรายการคำขอของผู้ใช้
    OrderModel.getUserOrders(req.session.user.id_user, (err, orders) => {
      if (err) {
        console.error('Error fetching user orders:', err);
        return res.status(500).send('Internal Server Error');
      }

      res.render('UserHome', {
        user: req.session.user,
        sectionName: sectionName,
        orders: orders // ส่งข้อมูลรายการคำขอไปยัง view
      });
    });
  });
});

router.get('/UserRequest', isLoggedIn, checkUserType('user'), (req, res) => {
  res.render('UserRequest', { user: req.session.user });
});

router.get('/UserStore', isLoggedIn, checkUserType('user'), async (req, res) => {
  const user = req.session.user;

  try {
      // Fetch the section name
      const sectionResults = await new Promise((resolve, reject) => {
          const query = 'SELECT section FROM tbl_emp_section WHERE id_emp_section = ?';
          db.query(query, [user.id_emp_section], (err, results) => {
              if (err) return reject(err);
              resolve(results);
          });
      });
      const sectionName = sectionResults[0] ? sectionResults[0].section : 'Unknown Section';

      // Fetch printer stocks
      const printerStocks = await WarehouseModel.getPrinterStockBySection(user.id_emp_section);

      // Fetch general items
      const generalItems = await WarehouseModel.getGeneralItems();

      res.render('UserStore', {
          user: user,
          sectionName: sectionName,
          printerStocks: printerStocks,
          generalItems: generalItems
      });
  } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;