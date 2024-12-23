const db = require('../db');

class PrinterStockModel {
    // ดึงข้อมูลสต็อกเครื่องพิมพ์ทั้งหมดและจัดกลุ่มข้อมูลตามแบรนด์เครื่องพิมพ์  และเพิ่ม STOCK เพื่อแสดงผลในหน้า AdminAllStock
    static updatePrinterStock(id, tonerType, quantity, callback) {
        console.log('Updating printer stock for id:', id, 'with toner type:', tonerType, 'and quantity:', quantity);
        let updateField;
        switch(tonerType) {
            case 'cyan': updateField = 'toner_c_quantity'; break;
            case 'magenta': updateField = 'toner_m_quantity'; break;
            case 'yellow': updateField = 'toner_y_quantity'; break;
            case 'black': updateField = 'toner_k_quantity'; break;
            case 'waste_toner': updateField = 'waste_toner_quantity'; break;
            case 'drum': updateField = 'drum_quantity'; break;
            default: return callback(new Error('Invalid toner type'));
        }
        const query = `UPDATE tbl_printer_stock SET ${updateField} = ? WHERE id_printer_stock = ?`;
        db.query(query, [quantity, id], callback);
    }

    // ดึงข้อมูลสต็อกเครื่องพิมพ์ทั้งหมดและจัดกลุ่มข้อมูลตามแบรนด์เครื่องพิมพ์  เพื่อแสดงผลในหน้า AdminAllStock
    static getAllPrinterStocks() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ps.*, ap.p_brand 
                FROM tbl_printer_stock ps
                JOIN tbl_add_printer ap ON ps.id_p_brand = ap.id_add_printer
            `;
            db.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = PrinterStockModel;