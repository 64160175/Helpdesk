const db = require('../db');

exports.insertOrder = (orderData, callback) => {
    console.log('Inserting order:', orderData);
    const query = 'INSERT INTO tbl_order (id_user, o_name, o_email, approve_status, reason, timestamp) VALUES (?, ?, ?, ?, ?, current_timestamp())';
    db.query(query, [orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        console.log('Order inserted with ID:', result.insertId);
        callback(null, result);
    });
};

exports.insertOrderItems = (orderItems, callback) => {
    console.log('Inserting order items:', orderItems);
    const query = 'INSERT INTO tbl_order_item (id_order_item, id_order, i_brand_name, type, quantity) VALUES ?';
    db.query(query, [orderItems], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        console.log('Order items inserted:', result.affectedRows);
        callback(null, result);
    });
};