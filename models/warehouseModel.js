const db = require('../db');

class WarehouseModel {

    //แสดงของทั้งหมดในคลัง
    static getAllItems() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT s.id_item_stock, a.i_brand, s.type, s.quantity
                FROM tbl_item_stock s
                JOIN tbl_add_item a ON s.id_add_item = a.id_add_item
                ORDER BY s.id_item_stock
            `;
            db.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = WarehouseModel;