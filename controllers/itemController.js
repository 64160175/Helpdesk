const ItemModel = require('../models/itemModel');

class ItemController {
    static getAdminItemPage(req, res) {
        ItemModel.getAllItems((err, items) => {
            if (err) {
                console.error('Error fetching items:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminItem', { items: items });
        });
    }
}

module.exports = ItemController;