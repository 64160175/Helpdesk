const db = require('../db');

exports.insertOrder = (orderData, callback) => {
    console.log('Inserting order:', orderData);

    const getLatestIdQuery = 'SELECT MAX(id_order) as maxId FROM tbl_order';
    db.query(getLatestIdQuery, (err, results) => {
        if (err) {
            console.error('Error retrieving latest ID:', err);
            return callback(err, null);
        }
        //Increment the ID
        const latestId = results[0].maxId || 0;
        const newId = latestId + 1;
        // Insert the new order with the incremented ID
        const query = 'INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp) VALUES (?, ?, ?, ?, ?, ?, current_timestamp())';
        db.query(query, [newId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return callback(err, null);
            }
            console.log('Order inserted with ID:', newId);
            callback(null, result);
        });
    });
};

exports.createOrderWithItems = (orderData, orderItems, callback) => {
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
            const insertOrderQuery = 'INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp) VALUES (?, ?, ?, ?, ?, ?, current_timestamp())';
            
            db.query(insertOrderQuery, [newOrderId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
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
                    const insertItemsQuery = 'INSERT INTO tbl_order_item (id_order_item, id_order, i_brand_name, type, quantity) VALUES ?';
                    const itemsToInsert = orderItems.map(item => {
                        latestItemId++;
                        return [latestItemId, newOrderId, item.i_brand_name, item.type, item.quantity];
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
                });
            });
        });
    });
};