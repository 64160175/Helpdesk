const db = require('../db');

exports.insertOrder = (orderData, callback) => {
    const getLatestIdQuery = 'SELECT MAX(id_order) as maxId FROM tbl_order';
    db.query(getLatestIdQuery, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        const latestId = results[0].maxId || 0;
        const newId = latestId + 1;
        const query = 'INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp) VALUES (?, ?, ?, ?, ?, ?, current_timestamp())';
        db.query(query, [newId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
            if (err) {
                return callback(err, null);
            }
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

                    const getBrandPromises = orderItems.map(item => {
                        return new Promise((resolve, reject) => {
                            let query;
                            let brandName = item.i_brand_name.split('\n')[0].trim();
                    
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
                                    resolve({ brand: brand, id: id });
                                }
                            });
                        });
                    });
                    
                    Promise.all(getBrandPromises)
                        .then(brandResults => {
                            const insertItemsQuery = 'INSERT INTO tbl_order_item (id_order_item, id_order, i_brand_name, type, quantity) VALUES ?';
                            const itemsToInsert = orderItems.map((item, index) => {
                                latestItemId++;
                                const brandInfo = brandResults[index];
                                const cleanBrandName = item.i_brand_name.split('\n')[0].trim();
                                return [latestItemId, newOrderId, cleanBrandName, item.type, item.quantity];
                            });
                    
                            console.log('Items to insert:', itemsToInsert);                    

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
                        .catch(err => {
                            return db.rollback(() => {
                                callback(err, null);
                            });
                        });
                });
            });
        });
    });
};