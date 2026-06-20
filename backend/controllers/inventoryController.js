const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const Alert = require('../models/Alert');

const getStatus = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    const statusList = products.map(p => {
      const stock = p.stock_level !== null && p.stock_level !== undefined ? Number(p.stock_level) : 0;
      const reorder = p.reorder_level !== null && p.reorder_level !== undefined ? Number(p.reorder_level) : 0;
      
      let status = 'Healthy';
      if (stock === 0) {
        status = 'Out of Stock';
      } else if (stock <= reorder) {
        status = 'Low Stock';
      }

      return {
        product: p.product_name || 'Unknown',
        stock: stock,
        status: status,
      };
    });

    res.json(statusList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStatus,
};
