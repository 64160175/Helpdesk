const Printer = require('../models/printerModel');

const printerController = {
  // Fetch all printers and render the view
  getAllPrinters: async (req, res) => {
    try {
      const printers = await Printer.getAllPrinters();
      res.render('AdminPrinter', { printers });
    } catch (error) {
      console.error('Error fetching printers:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Add a new printer
  addPrinter: async (req, res) => {
    try {
      const { printerBrand } = req.body;

      // Validate input
      if (!printerBrand || typeof printerBrand !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid input' });
      }

      const result = await Printer.addPrinter(printerBrand);
      res.json({ success: true, id: result.insertId });
    } catch (error) {
      console.error('Error adding printer:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = printerController;
