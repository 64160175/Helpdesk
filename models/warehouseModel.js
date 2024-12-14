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

    //แสดงของทั้งหมดในคลังตามประเภท สำหรับพิมพ์
    static getPrinterStockBySection(sectionId) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT ps.id_p_brand, ap.p_brand, ps.toner_cmyk, ps.toner_c_quantity, ps.toner_m_quantity, 
                       ps.toner_y_quantity, ps.toner_k_quantity, ps.waste_toner_quantity, ps.drum_quantity
                FROM tbl_printer_stock ps
                JOIN tbl_add_printer ap ON ps.id_p_brand = ap.id_add_printer
                JOIN tbl_printer tp ON ps.id_p_brand = tp.id_p_brand
                WHERE tp.id_emp_section = ?
            `;
            db.query(query, [sectionId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    //แสดงของทั้งหมดในคลังตามประเภท  สำหรับอุปกรณทั่วไป
    static getGeneralItems() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT tis.id_item_stock, tai.i_brand, tai.i_picture, tis.quantity, tis.type
                FROM tbl_item_stock tis
                JOIN tbl_add_item tai ON tis.id_add_item = tai.id_add_item
                WHERE tis.type IS NULL OR tis.type = 'general'
            `;
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

}

module.exports = WarehouseModel;