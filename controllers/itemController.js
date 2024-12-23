const ItemModel = require('../models/itemModel');

class ItemController {
    // แสดงหน้า AdminItem เพื่อแสดงรายการสินค้า พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminItem
    static getAdminItemPage(req, res) {
        ItemModel.getAllItems((err, items) => {
            if (err) {
                console.error('Error fetching items:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.render('AdminItem', { items: items });
        });
    }

    //แสดงหน้า AddItem เพื่อเพิ่มสินค้า พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AddItem
    static showAddItemForm(req, res) {
        res.render('addItem');
    }

    //เพิ่มสินค้าใหม่ พร้อมส่งข้อมูลไปยัง template #อยู่หน้า AdminItem
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

    //แสดงหน้า EditItem เพื่อแก้ไขสินค้า พร้อมส่งข้อมูลไปยัง template #อยู่หน้า EditItem
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