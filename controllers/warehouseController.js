const WarehouseModel = require('../models/warehouseModel');
const PrinterStockModel = require('../models/printerStockModel');

class WarehouseController {
    static getAllItems(req, res) {
        WarehouseModel.getAllItems((err, items) => {
            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            
            PrinterStockModel.getAllPrinterStocks((printerErr, printerStocks) => {
                if (printerErr) {
                    console.error('Error fetching printer stocks:', printerErr);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                
                res.render('AdminAllStock', { items: items, printerStocks: printerStocks });
            });
        });
    }

    static updatePrinterStock(req, res) {
        const { id, quantity } = req.body;
        PrinterStockModel.updatePrinterStock(id, quantity, (err, result) => {
            if (err) {
                console.error('Error updating printer stock:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return;
            }
            res.json({ success: true, message: 'Printer stock updated successfully' });
        });
    }
}

module.exports = WarehouseController;