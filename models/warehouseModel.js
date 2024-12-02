const db = require('../db');

class WarehouseModel {
    static getAllItems(callback) {
        const query = `
            SELECT s.id_item_stock, a.i_brand, s.type, s.quantity
            FROM tbl_item_stock s
            JOIN tbl_add_item a ON s.id_add_item = a.id_add_item
            ORDER BY s.id_item_stock
        `;
        db.query(query, callback);
    }

    static updateStock(id, quantity, callback) {
        const query = 'UPDATE tbl_item_stock SET quantity = quantity + ? WHERE id_item_stock = ?';
        db.query(query, [quantity, id], callback);
    }
}

module.exports = WarehouseModel;