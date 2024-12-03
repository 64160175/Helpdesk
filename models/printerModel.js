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
      const query = 'INSERT INTO tbl_add_printer (p_brand) VALUES (?)';
      db.query(query, [printerBrand], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }


  static updatePrinterStatus(printerId, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE tbl_printer SET p_status = ? WHERE id_add_printer = ?`;
      db.query(sql, [status, printerId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
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
      const sql = `INSERT INTO tbl_printer (id_p_brand, p_serial, id_emp_section, p_status) VALUES (?, ?, ?, 'active')`; // Set p_status to 'active'
      db.query(sql, [id_p_brand, p_serial, id_emp_section], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
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
        const sql = 'SELECT * FROM tbl_emp_section WHERE status = "active"';  // Add WHERE clause
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

