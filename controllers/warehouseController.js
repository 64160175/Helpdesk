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

    static async updatePrinterStock(req, res) {
        try {
            const { id, quantity } = req.body;
            await PrinterStockModel.updatePrinterStock(id, quantity);
            res.json({ message: 'Printer stock updated successfully' });
        } catch (error) {
            console.error('Error updating printer stock:', error);
            res.status(500).json({ error: 'An error occurred while updating printer stock' });
        }
    }

    static async updateItemStock(req, res) {
        try {
            const { id, quantity } = req.body;
            await WarehouseModel.updateStock(id, quantity);
            res.json({ message: 'Item stock updated successfully' });
        } catch (error) {
            console.error('Error updating item stock:', error);
            res.status(500).json({ error: 'An error occurred while updating item stock' });
        }
    }
}

module.exports = WarehouseController;