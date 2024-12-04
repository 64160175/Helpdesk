const PrinterModel = require('../models/printerModel');

class PrinterController {
    static async getAllPrinters(req, res) {
        try {
            const printers = await PrinterModel.getAllPrinters();
            const printerBrands = await PrinterModel.getAllPrinterBrands(); // Fetch all printer brands
            const sections = await PrinterModel.getAllSections(); // Fetch all sections

            res.render('AdminPrinter', { printers, printerBrands, sections }); // Pass all three
        } catch (error) {
            console.error('Error fetching printers:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
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

    static async addPrinterSerial(req, res) {
        try {
            console.log('Received body:', req.body); // Log ข้อมูลที่ได้รับ

            const { id_p_brand, p_serial, id_emp_section } = req.body;

            if (!id_p_brand || !p_serial || !id_emp_section) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    receivedData: req.body
                });
            }

            const result = await PrinterModel.addPrinterSerial(id_p_brand, p_serial, id_emp_section);
            res.json({ success: true, message: "Printer serial added successfully" });
        } catch (error) {
            console.error("Error adding printer serial:", error);
            res.status(500).json({ success: false, message: "Failed to add printer serial", error: error.message });
        }
    }

    static async getAddPrinterPage(req, res) {
        try {
            const printerBrands = await PrinterModel.getAllPrinterBrands();
            const sections = await PrinterModel.getAllSections();
            res.render('AdminPrinter', { printerBrands, sections });
        } catch (error) {
            console.error("Error fetching data for add printer page:", error);
            res.status(500).send("Internal Server Error");
        }
    }
}


module.exports = PrinterController;

