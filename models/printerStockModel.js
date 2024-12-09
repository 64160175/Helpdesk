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

    
}

module.exports = PrinterStockModel;