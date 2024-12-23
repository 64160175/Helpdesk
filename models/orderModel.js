const db = require('../db');

class OrderModel {
  static getUserOrders(userId, callback) {
    const query = `
      SELECT id_order, o_name, approve_status, timestamp
      FROM tbl_order
      WHERE id_user = ?
      ORDER BY timestamp DESC
    `;
    db.query(query, [userId], callback);
  }

  static getOrderById(orderId, callback) {
    const query = 'SELECT * FROM tbl_order WHERE id_order = ?';
    db.query(query, [orderId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static getOrderItemsByOrderId(orderId, callback) {
    const query = 'SELECT * FROM tbl_order_item WHERE id_order = ?';
    db.query(query, [orderId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static getOrderDetails(orderId, callback) {
    const query = `
      SELECT o.id_order, o.o_name, o.o_email, o.approve_status, o.reason, oi.i_brand_name, oi.type, oi.quantity
      FROM tbl_order o
      JOIN tbl_order_item oi ON o.id_order = oi.id_order
      WHERE o.id_order = ?
    `;
    db.query(query, [orderId], (err, results) => {
      if (err) {
        console.error('Error retrieving order details:', err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }

  // เพิ่มข้อมูลออร์เดอร์ใหม่
  static insertOrder(orderData, callback) {
    const getLatestIdQuery = 'SELECT MAX(id_order) as maxId FROM tbl_order';
    db.query(getLatestIdQuery, (err, results) => {
      if (err) {
        return callback(err, null);
      }

      const latestId = results[0].maxId || 0;
      const newId = latestId + 1;
      const query = `
        INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, current_timestamp())
      `;
      db.query(query, [newId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
    });
  }

  // เพิ่มออร์เดอร์พร้อมกับรายการสินค้า
  static createOrderWithItems(orderData, orderItems, callback) {
    db.beginTransaction((err) => {
      if (err) {
        return callback(err, null);
      }

      const getLatestIdQuery = 'SELECT MAX(id_order) as maxId FROM tbl_order';
      db.query(getLatestIdQuery, (err, results) => {
        if (err) {
          return db.rollback(() => {
            callback(err, null);
          });
        }

        const newOrderId = (results[0].maxId || 0) + 1;

        const insertOrderQuery = `
          INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, current_timestamp())
        `;

        db.query(insertOrderQuery, [newOrderId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err) => {
          if (err) {
            return db.rollback(() => {
              callback(err, null);
            });
          }

          const getLatestItemIdQuery = 'SELECT MAX(id_order_item) as maxItemId FROM tbl_order_item';
          db.query(getLatestItemIdQuery, (err, itemResults) => {
            if (err) {
              return db.rollback(() => {
                callback(err, null);
              });
            }

            let latestItemId = itemResults[0].maxItemId || 0;

            const getBrandPromises = orderItems.map((item) => {
              return new Promise((resolve, reject) => {
                let query;
                const brandName = item.i_brand_name.split('\n')[0].trim();

                if (item.type === 'general') {
                  query = `
                    SELECT i.i_brand, i.id_add_item
                    FROM tbl_add_item i
                    WHERE i.i_brand = ?
                  `;
                } else if (['black', 'color', 'cyan', 'magenta', 'yellow', 'waste_toner', 'drum'].includes(item.type)) {
                  query = `
                    SELECT p.p_brand, p.id_add_printer
                    FROM tbl_add_printer p
                    WHERE p.p_brand = ?
                  `;
                } else {
                  return resolve({ brand: 'Unknown', id: null });
                }

                db.query(query, [brandName], (err, results) => {
                  if (err) {
                    reject(err);
                  } else if (results.length === 0) {
                    resolve({ brand: brandName, id: null });
                  } else {
                    const brand = item.type === 'general' ? results[0].i_brand : results[0].p_brand;
                    const id = item.type === 'general' ? results[0].id_add_item : results[0].id_add_printer;
                    resolve({ brand, id });
                  }
                });
              });
            });

            Promise.all(getBrandPromises)
              .then((brandResults) => {
                const insertItemsQuery = `
                  INSERT INTO tbl_order_item (id_order_item, id_order, i_brand_name, type, quantity)
                  VALUES ?
                `;

                const itemsToInsert = orderItems.map((item, index) => {
                  latestItemId++;
                  const brandInfo = brandResults[index];
                  const cleanBrandName = item.i_brand_name.split('\n')[0].trim();
                  return [latestItemId, newOrderId, cleanBrandName, item.type, item.quantity];
                });

                db.query(insertItemsQuery, [itemsToInsert], (err, itemResult) => {
                  if (err) {
                    return db.rollback(() => {
                      callback(err, null);
                    });
                  }

                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => {
                        callback(err, null);
                      });
                    }
                    callback(null, { orderId: newOrderId, itemsInserted: itemResult.affectedRows });
                  });
                });
              })
              .catch((err) => {
                return db.rollback(() => {
                  callback(err, null);
                });
              });
          });
        });
      });
    });
  }



  //MGR แสดง request ทั้งหมด
  static getOrdersByManagerSection(managerSectionId, callback) {
    const query = `
      SELECT o.id_order, o.timestamp, o.approve_status, o.o_name,
             s.section as section_name
      FROM tbl_order o
      JOIN tbl_user u ON o.id_user = u.id_user
      JOIN tbl_emp_section s ON u.id_emp_section = s.id_emp_section
      WHERE s.id_emp_section = ?
      ORDER BY o.timestamp DESC
    `;
  
    db.query(query, [managerSectionId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }

  
}

module.exports = OrderModel;
