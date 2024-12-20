const PrinterStockModel = require('../models/printerStockModel');

class PrinterStockController {
  static async getAllPrinterStocks(req, res) {
    try {
      const printerStocks = await PrinterStockModel.getAllPrinterStocks();
      // Group printer stocks by printer brand
      const groupedStocks = printerStocks.reduce((acc, stock) => {
        if (!acc[stock.id_p_brand]) {
          acc[stock.id_p_brand] = {
            brand: stock.p_brand,
            stocks: []
          };
        }
        acc[stock.id_p_brand].stocks.push(stock);
        return acc;
      }, {});

      res.render('AdminAllStock', { printerStocks: groupedStocks, items: [] });
    } catch (error) {
      console.error('Error fetching printer stocks:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = PrinterStockController;