const db = require('../db');

class ItemModel {
    static addItem(itemName, itemPicture, type, callback) {
        db.beginTransaction((err) => {
            if (err) { return callback(err); }

            // ตรวจสอบว่า itemPicture เป็น Buffer หรือไม่
            let pictureBuffer = itemPicture;
            if (typeof itemPicture === 'string') {
                // ถ้าเป็น Base64 string ให้แปลงเป็น Buffer
                pictureBuffer = Buffer.from(itemPicture, 'base64');
            } else if (!(itemPicture instanceof Buffer)) {
                // ถ้าไม่ใช่ทั้ง string และ Buffer ให้ set เป็น null
                pictureBuffer = null;
            }

            // หา ID ล่าสุด
            const getLatestIdQuery = 'SELECT MAX(id_add_item) as maxId FROM tbl_add_item';
            db.query(getLatestIdQuery, (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        callback(error);
                    });
                }

                const latestId = results[0].maxId || 0;
                const newId = latestId + 1;

                // เพิ่มรายการใหม่ด้วย ID ที่เพิ่มขึ้น
                // เพิ่มรายการใหม่ด้วย ID ที่เพิ่มขึ้น
                const addItemQuery = 'INSERT INTO tbl_add_item (id_add_item, i_brand, i_picture) VALUES (?, ?, ?)';
                db.query(addItemQuery, [newId, itemName, pictureBuffer], (error, results) => {    
                    if (error) {
                        return db.rollback(() => {
                            callback(error);
                        });
                    }
    
                    // หา ID ล่าสุดในตาราง tbl_item_stock
                    const getLatestStockIdQuery = 'SELECT MAX(id_item_stock) as maxStockId FROM tbl_item_stock';
                    db.query(getLatestStockIdQuery, (error, stockResults) => {
                        if (error) {
                            return db.rollback(() => {
                                callback(error);
                            });
                        }

                        const latestStockId = stockResults[0].maxStockId || 0;
                        const newStockId = latestStockId + 1;

                        const addStockQuery = 'INSERT INTO tbl_item_stock (id_item_stock, id_add_item, type, quantity) VALUES (?, ?, ?, ?)';
                        db.query(addStockQuery, [newStockId, newId, type || null, 0], (error) => {
                            if (error) {
                                return db.rollback(() => {
                                    callback(error);
                                });
                            }
    
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        callback(err);
                                    });
                                }
                                callback(null, newId);
                            });
                        });
                    });
                });
            });
        });
    }

    static getAllItems(callback) {
        const query = 'SELECT id_add_item, i_brand, i_picture FROM tbl_add_item ORDER BY id_add_item';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            const itemsWithBase64Images = results.map(item => ({
                ...item,
                i_picture: item.i_picture ? item.i_picture.toString('base64') : null
            }));
            callback(null, itemsWithBase64Images);
        });
    }
}

module.exports = ItemModel;