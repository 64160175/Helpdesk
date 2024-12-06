const db = require('../db');

class PrinterStockModel {
    static getAllPrinterStocks(callback) {
        const query = `
            SELECT ps.*, ap.p_brand 
            FROM tbl_printer_stock ps
            JOIN tbl_add_printer ap ON ps.id_p_brand = ap.id_add_printer
        `;
        db.query(query, callback);
    }

    static updatePrinterStock(id, quantity, callback) {
        const query = `
            UPDATE tbl_printer_stock 
            SET toner_c_quantity = ?, toner_m_quantity = ?, toner_y_quantity = ?, toner_k_quantity = ?, waste_toner_quantity = ?, drum_quantity = ?
            WHERE id_printer_stock = ?
        `;
        db.query(query, [quantity, quantity, quantity, quantity, quantity, quantity, id], callback);
    }
}

module.exports = PrinterStockModel;