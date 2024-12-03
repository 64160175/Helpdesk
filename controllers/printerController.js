const PrinterModel = require('../models/printerModel');

class PrinterController {
    static async getAllPrinters(req, res) {
        try {
            const printers = await PrinterModel.getAllPrinters();
            res.render('AdminPrinter', { printers });
        } catch (error) {
            console.error('Error fetching printers:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async addPrinter(req, res) {
        try {
            const { printerBrand } = req.body;

            // Validate input
            if (!printerBrand || typeof printerBrand !== 'string') {
                return res.status(400).json({ success: false, message: 'Invalid input' });
            }

            const result = await PrinterModel.addPrinter(printerBrand);
            res.json({ success: true, id: result.insertId });
        } catch (error) {
            console.error('Error adding printer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // Include the deletePrinter method (modified from previous examples)
    static async deletePrinter(req, res) {
        const printerId = req.params.id; // Assuming you'll use a route like /delete-printer/:id

        try {
            const result = await PrinterModel.updatePrinterStatus(printerId, 'inactive');
            if (result.affectedRows > 0) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Printer not found' });
            }
        } catch (error) {
            console.error('Error deleting printer:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}


module.exports = PrinterController;

