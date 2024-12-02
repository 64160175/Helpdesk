const Printer = require('../models/printerModel');

const printerController = {
  getAllPrinters: async (req, res) => {
    try {
      const printers = await Printer.getAllPrinters();
      res.render('AdminPrinter', { printers });
    } catch (error) {
      console.error('Error fetching printers:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // เพิ่มฟังก์ชันอื่นๆ ตามความต้องการ เช่น addPrinter, updatePrinter, deletePrinter
};

module.exports = printerController;