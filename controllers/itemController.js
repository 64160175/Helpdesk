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

    static showAddItemForm(req, res) {
        res.render('addItem');
    }

    static addItem(req, res) {
        const { itemName } = req.body;
        const itemPicture = req.file ? req.file.buffer : null;

        ItemModel.addItem(itemName, itemPicture, (error, itemId) => {
            res.redirect("/AdminItem");
        });
    }
}

module.exports = ItemController;