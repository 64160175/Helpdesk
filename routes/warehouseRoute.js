const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const ItemController = require('../controllers/itemController');
const PrinterController = require('../controllers/printerController');
const { isLoggedIn, checkUserType } = require('../middlewares/authMiddleware');
const WarehouseController = require('../controllers/warehouseController');

// Route สำหรับหน้าคลังอุปกรณ์ทั้งหมด
router.get('/AdminAllStock', isLoggedIn, checkUserType('admin'), WarehouseController.getAllItems);

// Route สำหรับหน้าสร้างวัสดุทั่วไป
router.get('/AdminItem', isLoggedIn, checkUserType('admin'), ItemController.getAdminItemPage);
router.post('/admin/add-item', isLoggedIn, checkUserType('admin'), upload.single('itemPicture'), ItemController.addItem);

// Route สำหรับเพิ่มเครื่องปริ้นเตอร์
router.get('/AdminPrinter', isLoggedIn, checkUserType('admin'), PrinterController.getAllPrinters);
router.post('/add-printer', isLoggedIn, checkUserType('admin'), express.json(), PrinterController.addPrinter);
router.post('/delete-printer/:id', PrinterController.deletePrinter); 
router.post('/add-printer-serial', express.json(), PrinterController.addPrinterSerial);

router.post('/updatePrinterStock', isLoggedIn, checkUserType('admin'), express.json(), WarehouseController.updatePrinterStock);
router.post('/updateStock', isLoggedIn, checkUserType('admin'), express.json(), ItemController.updateStock);

router.get('/UserStore', isLoggedIn, checkUserType('user'), WarehouseController.getPrinterStockBySection);
router.get('/printer-stocks', isLoggedIn, checkUserType('user'), WarehouseController.getPrinterStockBySection);

module.exports = router;