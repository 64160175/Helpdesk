const db = require('../db');

class ItemModel {
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