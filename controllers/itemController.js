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
        const { itemName, type } = req.body;
        let itemPicture = null;

        if (req.file) {
            itemPicture = req.file.buffer.toString('base64');
        }

        ItemModel.addItem(itemName, itemPicture, type, (error, itemId) => {
            if (error) {
                console.error('Error adding item:', error);
                return res.status(500).send('Error adding item');
            }
            res.redirect("/AdminItem");
        });
    }

    //อัปเดต Stock วัสดุทั่วไป
    static updateStock(req, res) {
        const { id, quantity } = req.body;
    
        ItemModel.updateStock(id, parseInt(quantity), (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error updating stock' });
            }
            res.json({ success: true, message: 'Stock updated successfully' });
        });
    }
}

module.exports = ItemController;