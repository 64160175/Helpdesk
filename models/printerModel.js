const db = require('../db');

class PrinterModel {
  static getAllPrinters() {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT p.id_printer, ap.p_brand, p.p_serial, es.section, p.p_status
                FROM tbl_printer p
                JOIN tbl_add_printer ap ON p.id_p_brand = ap.id_add_printer
                JOIN tbl_emp_section es ON p.id_emp_section = es.id_emp_section
                WHERE p.p_status = 'active' 
                ORDER BY p.id_printer
            `;
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static addPrinter(printerBrand) {
    return new Promise((resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) return reject(err);
  
        const getLatestIdQuery = 'SELECT MAX(id_add_printer) as maxId FROM tbl_add_printer';
        db.query(getLatestIdQuery, (error, results) => {
          if (error) {
            return db.rollback(() => reject(error));
          }
  
          const latestId = results[0].maxId || 0;
          const newId = latestId + 1;
          const insertQuery = 'INSERT INTO tbl_add_printer (id_add_printer, p_brand) VALUES (?, ?)';
          db.query(insertQuery, [newId, printerBrand], (error, results) => {
            if (error) {
              return db.rollback(() => reject(error));
            }
  
            // หา id_printer_stock ที่มากที่สุด
            const getLatestStockIdQuery = 'SELECT MAX(id_printer_stock) as maxStockId FROM tbl_printer_stock';
            db.query(getLatestStockIdQuery, (error, stockResults) => {
              if (error) {
                return db.rollback(() => reject(error));
              }
  
              const latestStockId = stockResults[0].maxStockId || 0;
              const tonerTypes = ['cyan', 'magenta', 'yellow', 'black', 'waste_toner', 'drum'];
              const insertStockQuery = `
                INSERT INTO tbl_printer_stock 
                (id_printer_stock, id_p_brand, toner_cmyk, toner_c_quantity, toner_m_quantity, toner_y_quantity, toner_k_quantity, waste_toner_quantity, drum_quantity) 
                VALUES ?
              `;
  
              const stockValues = tonerTypes.map((type, index) => {
                const newStockId = latestStockId + index + 1;
                return [newStockId, newId, type, null, null, null, null, null, null];
              });
  
              db.query(insertStockQuery, [stockValues], (error) => {
                if (error) {
                  return db.rollback(() => reject(error));
                }
  
                db.commit((err) => {
                  if (err) {
                    return db.rollback(() => reject(err));
                  }
                  resolve(results);
                });
              });
            });
          });
        });
      });
    });
  }

  static updatePrinterStatus(printerId, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE tbl_printer SET p_status = ? WHERE id_printer = ?`;
      db.query(sql, [status, printerId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static addPrinterSerial(id_p_brand, p_serial, id_emp_section) {
    return new Promise((resolve, reject) => {
      // First, get the latest ID
      const getLatestIdQuery = 'SELECT MAX(id_printer) as maxId FROM tbl_printer';
      db.query(getLatestIdQuery, (error, results) => {
        if (error) {
          console.error('Error getting latest ID:', error);
          return reject(error);
        }

        const latestId = results[0].maxId || 0;
        const newId = latestId + 1;

        const sql = `INSERT INTO tbl_printer (id_printer, id_p_brand, p_serial, id_emp_section, p_status) VALUES (?, ?, ?, ?, 'active')`;
        db.query(sql, [newId, id_p_brand, p_serial, id_emp_section], (err, result) => {
          if (err) {
            console.error('SQL Error:', err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  static getAllPrinterBrands() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tbl_add_printer';
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  static getAllSections() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tbl_emp_section WHERE status = "active"';
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = PrinterModel;

