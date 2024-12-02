const db = require('../db');

const Printer = {
  getAllPrinters: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.id_printer, ap.p_brand, p.p_serial, es.section, p.p_status
        FROM tbl_printer p
        JOIN tbl_add_printer ap ON p.id_p_brand = ap.id_add_printer
        JOIN tbl_emp_section es ON p.id_emp_section = es.id_emp_section
        ORDER BY p.id_printer
      `;
      db.query(query, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  // เพิ่มฟังก์ชันอื่นๆ ตามความต้องการ เช่น addPrinter, updatePrinter, deletePrinter
};

module.exports = Printer;