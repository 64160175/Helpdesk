const db = require('../db');

class ItemModel {
    static addItem(itemName, itemPicture, callback) {
        const query = 'INSERT INTO tbl_add_item (i_brand, i_picture) VALUES (?, ?)';
        db.query(query, [itemName, itemPicture], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results.insertId);
        });
    }

    static getAllItems(callback) {
        const query = 'SELECT id_add_item, i_brand, i_picture FROM tbl_add_item ORDER BY id_add_item';
        db.query(query, (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    }
}

module.exports = ItemModel;