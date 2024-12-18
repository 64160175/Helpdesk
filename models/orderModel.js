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
    console.log('Starting createOrderWithItems');
    console.log('Order Data:', orderData);
    console.log('Order Items:', orderItems);

    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return callback(err, null);
        }

        const getLatestIdQuery = 'SELECT MAX(id_order) as maxId FROM tbl_order';
        db.query(getLatestIdQuery, (err, results) => {
            if (err) {
                console.error('Error getting latest order ID:', err);
                return db.rollback(() => {
                    callback(err, null);
                });
            }

            const newOrderId = (results[0].maxId || 0) + 1;
            console.log('New Order ID:', newOrderId);

            const insertOrderQuery = 'INSERT INTO tbl_order (id_order, id_user, o_name, o_email, approve_status, reason, timestamp) VALUES (?, ?, ?, ?, ?, ?, current_timestamp())';

            db.query(insertOrderQuery, [newOrderId, orderData.id_user, orderData.o_name, orderData.o_email, orderData.approve_status, orderData.reason], (err, result) => {
                if (err) {
                    console.error('Error inserting order:', err);
                    return db.rollback(() => {
                        callback(err, null);
                    });
                }

                console.log('Order inserted successfully');

                const getLatestItemIdQuery = 'SELECT MAX(id_order_item) as maxItemId FROM tbl_order_item';
                db.query(getLatestItemIdQuery, (err, itemResults) => {
                    if (err) {
                        console.error('Error getting latest order item ID:', err);
                        return db.rollback(() => {
                            callback(err, null);
                        });
                    }

                    let latestItemId = itemResults[0].maxItemId || 0;
                    console.log('Latest Item ID:', latestItemId);

                    // Prepare queries to get brand names
                    const getBrandPromises = orderItems.map(item => {
                        return new Promise((resolve, reject) => {
                            let query;
                            let brandName = item.i_brand_name.split('\n')[0].trim(); // ใช้เฉพาะบรรทัดแรกและตัดช่องว่าง
                    
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
                                console.warn(`Unknown item type: ${item.type}`);
                                return resolve({ brand: 'Unknown', id: null });
                            }
                            console.log(`Executing query: ${query} with brand: ${brandName}`);
                            db.query(query, [brandName], (err, results) => {
                                if (err) {
                                    console.error('Error fetching brand:', err);
                                    reject(err);
                                } else if (results.length === 0) {
                                    console.warn(`No brand found for item type ${item.type} with brand ${brandName}`);
                                    resolve({ brand: brandName, id: null });
                                } else {
                                    const brand = item.type === 'general' ? results[0].i_brand : results[0].p_brand;
                                    const id = item.type === 'general' ? results[0].id_add_item : results[0].id_add_printer;
                                    console.log(`Found brand: ${brand} with id: ${id} for item type ${item.type}`);
                                    resolve({ brand: brand, id: id });
                                }
                            });
                        });
                    });
                    
                    // ... (โค้ดที่เหลือยังคงเหมือนเดิม)
                    
                    Promise.all(getBrandPromises)
                        .then(brandResults => {
                            const insertItemsQuery = 'INSERT INTO tbl_order_item (id_order_item, id_order, i_brand_name, type, quantity) VALUES ?';
                            const itemsToInsert = orderItems.map((item, index) => {
                                latestItemId++;
                                const brandInfo = brandResults[index];
                                const cleanBrandName = item.i_brand_name.split('\n')[0].trim(); // ใช้เฉพาะบรรทัดแรกและตัดช่องว่าง
                                console.log(`Inserting item: type=${item.type}, brand=${cleanBrandName}, id=${brandInfo.id}`);
                                return [latestItemId, newOrderId, cleanBrandName, item.type, item.quantity];
                            });
                    
                            console.log('Items to insert:', itemsToInsert);                    

                            db.query(insertItemsQuery, [itemsToInsert], (err, itemResult) => {
                                if (err) {
                                    console.error('Error inserting order items:', err);
                                    return db.rollback(() => {
                                        callback(err, null);
                                    });
                                }

                                console.log('Order items inserted successfully');

                                db.commit((err) => {
                                    if (err) {
                                        console.error('Error committing transaction:', err);
                                        return db.rollback(() => {
                                            callback(err, null);
                                        });
                                    }
                                    console.log('Transaction committed successfully');
                                    callback(null, { orderId: newOrderId, itemsInserted: itemResult.affectedRows });
                                });
                            });
                        })
                        .catch(err => {
                            console.error('Error getting brand names:', err);
                            return db.rollback(() => {
                                callback(err, null);
                            });
                        });
                });
            });
        });
    });
};