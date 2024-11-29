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

    
            const addItemQuery = 'INSERT INTO tbl_add_item (i_brand, i_picture) VALUES (?, ?)';
            db.query(addItemQuery, [itemName, pictureBuffer], (error, results) => {    
                if (error) {
                    return db.rollback(() => {
                        callback(error);
                    });
                }
    
                const id_add_item = results.insertId;
                const addStockQuery = 'INSERT INTO tbl_item_stock (id_add_item, type, quantity) VALUES (?, ?, ?)';
                db.query(addStockQuery, [id_add_item, type || null, 0], (error) => {
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
                        callback(null, id_add_item);
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