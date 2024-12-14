const WarehouseModel = require('../models/warehouseModel');
const PrinterStockModel = require('../models/printerStockModel');

class WarehouseController {
    static async getAllItems(req, res) {
        try {
            const items = await WarehouseModel.getAllItems();
            const printerStocks = await PrinterStockModel.getAllPrinterStocks();
            res.render('AdminAllStock', { items: items, printerStocks: printerStocks });
        } catch (error) {
            console.error('Error fetching stocks:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static updatePrinterStock(req, res) {
        const { id, tonerType, quantity } = req.body;
        console.log('Received update request:', { id, tonerType, quantity });

        if (!id || !tonerType || isNaN(quantity)) {
            console.warn('Invalid input data:', { id, tonerType, quantity });
            return res.status(400).json({ success: false, message: 'Invalid input data' });
        }

        PrinterStockModel.updatePrinterStock(id, tonerType, quantity, (err, result) => {
            if (err) {
                console.error('Error updating printer stock:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return;
            }
            console.log('Printer stock updated successfully:', result);
            res.json({ success: true, message: 'Printer stock updated successfully' });
        });
    }

    static async updateItemStock(req, res) {
        try {
            const { id, quantity } = req.body;
            console.log('Received item stock update request:', { id, quantity });

            if (!id || isNaN(quantity)) {
                console.warn('Invalid input data for item stock update:', { id, quantity });
                return res.status(400).json({ error: 'Invalid input data' });
            }

            await WarehouseModel.updateStock(id, quantity);
            console.log('Item stock updated successfully for item ID:', id);
            res.json({ message: 'Item stock updated successfully' });
        } catch (error) {
            console.error('Error updating item stock:', error);
            res.status(500).json({ error: 'An error occurred while updating item stock' });
        }
    }


    //
    static async getPrinterStockBySection(req, res) {
        try {
            const sectionId = req.session.user.id_emp_section;
            const printerStocks = await WarehouseModel.getPrinterStockBySection(sectionId);
            res.json(printerStocks);
        } catch (error) {
            console.error('Error fetching printer stocks:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = WarehouseController;