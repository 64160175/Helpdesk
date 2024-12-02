const WarehouseModel = require('../models/warehouseModel');

class WarehouseController {
    static getAllItems(req, res) {
        WarehouseModel.getAllItems((err, results) => {
            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.render('AdminAllStock', { items: results });
        });
    }

    static updateStock(req, res) {
        const { id, quantity } = req.body;
        WarehouseModel.updateStock(id, quantity, (err, result) => {
            if (err) {
                console.error('Error updating stock:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return;
            }
            res.json({ success: true, message: 'Stock updated successfully' });
        });
    }
}

module.exports = WarehouseController;