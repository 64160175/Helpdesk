const db = require('../db');

class PrinterStockModel {
    static getAllPrinterStocks() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ps.id_printer_stock, ap.p_brand, ps.toner_cmyk,
                ps.toner_c_quantity, ps.toner_m_quantity, ps.toner_y_quantity,
                ps.toner_k_quantity, ps.waste_toner_quantity, ps.drum_quantity
                FROM tbl_printer_stock ps
                JOIN tbl_add_printer ap ON ps.id_p_brand = ap.id_add_printer
                ORDER BY ps.id_printer_stock
            `;
            db.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
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
                else resolve(results);
            });
        });
    }
}

module.exports = PrinterStockModel;