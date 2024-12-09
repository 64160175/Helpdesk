const db = require('../db');

class WarehouseModel {
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

    static updateStock(id, quantity) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE tbl_item_stock SET quantity = quantity + ? WHERE id_item_stock = ?';
            db.query(query, [quantity, id], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    static getPrinterStock(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ps.id_printer_stock, ap.p_brand, ps.toner_cmyk,
                CASE
                    WHEN ps.toner_cmyk = 'cyan' THEN ps.toner_c_quantity
                    WHEN ps.toner_cmyk = 'magenta' THEN ps.toner_m_quantity
                    WHEN ps.toner_cmyk = 'yellow' THEN ps.toner_y_quantity
                    WHEN ps.toner_cmyk = 'black' THEN ps.toner_k_quantity
                    WHEN ps.toner_cmyk = 'waste_toner' THEN ps.waste_toner_quantity
                    WHEN ps.toner_cmyk = 'drum' THEN ps.drum_quantity
                END AS current_stock
                FROM tbl_printer_stock ps
                JOIN tbl_add_printer ap ON ps.id_p_brand = ap.id_add_printer
                WHERE ps.id_printer_stock = ?
            `;
            db.query(query, [id], (error, results) => {
                if (error) reject(error);
                resolve(results[0]);
            });
        });
    }

    static updatePrinterStock(id, quantity) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE tbl_printer_stock
                SET 
                    toner_c_quantity = CASE WHEN toner_cmyk = 'cyan' THEN toner_c_quantity + ? ELSE toner_c_quantity END,
                    toner_m_quantity = CASE WHEN toner_cmyk = 'magenta' THEN toner_m_quantity + ? ELSE toner_m_quantity END,
                    toner_y_quantity = CASE WHEN toner_cmyk = 'yellow' THEN toner_y_quantity + ? ELSE toner_y_quantity END,
                    toner_k_quantity = CASE WHEN toner_cmyk = 'black' THEN toner_k_quantity + ? ELSE toner_k_quantity END,
                    waste_toner_quantity = CASE WHEN toner_cmyk = 'waste_toner' THEN waste_toner_quantity + ? ELSE waste_toner_quantity END,
                    drum_quantity = CASE WHEN toner_cmyk = 'drum' THEN drum_quantity + ? ELSE drum_quantity END
                WHERE id_printer_stock = ?
            `;
            db.query(query, [quantity, quantity, quantity, quantity, quantity, quantity, id], (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = WarehouseModel;