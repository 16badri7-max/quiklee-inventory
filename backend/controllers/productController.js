const Product = require('../models/Product');
const InventoryHistory = require('../models/InventoryHistory');
const Alert = require('../models/Alert');
const { body } = require('express-validator');

const productValidation = [
  body('product_name').notEmpty().withMessage('Product name required'),
  body('sku').notEmpty().withMessage('SKU required'),
  body('category').notEmpty().withMessage('Category required'),
  body('store_name').notEmpty().withMessage('Store name required'),
  body('stock_level')
    .isInt({ min: 0 })
    .withMessage('Stock level must be >= 0'),
  body('picked_quantity')
    .isInt({ min: 0 })
    .withMessage('Pick quantity must be >= 0'),
  body('reorder_level')
    .isInt({ min: 0 })
    .withMessage('Reorder level must be >= 0'),
  body('status')
    .isIn(['active', 'inactive', 'archived'])
    .withMessage('Invalid status'),
];

// Helper to trigger alerts
const checkAndTriggerAlert = async (productId, name, sku, stockLevel, reorderLevel) => {
  if (stockLevel === 0) {
    await Alert.create(productId, 'Out of Stock', `Product '${name}' (SKU: ${sku}) is completely Out of Stock!`);
  } else if (stockLevel <= reorderLevel) {
    await Alert.create(productId, 'Low Stock', `Product '${name}' (SKU: ${sku}) is at Low Stock. Current: ${stockLevel}, Reorder Level: ${reorderLevel}`);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const id = await Product.create(req.body);
    // Log history and check alert
    await InventoryHistory.log(id, 0, req.body.stock_level);
    await checkAndTriggerAlert(id, req.body.product_name, req.body.sku, Number(req.body.stock_level), Number(req.body.reorder_level));

    res.status(201).json({ id, message: 'Product created successfully' });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const filter = {
      status: req.query.status,
      search: req.query.search,
    };
    const products = await Product.findAll(filter);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldProduct = await Product.findById(id);
    if (!oldProduct) return res.status(404).json({ message: 'Product not found' });

    const rows = await Product.update(id, req.body);
    if (!rows) return res.status(404).json({ message: 'Product not found' });

    // If stock level changed, log history and check alert
    const newStock = Number(req.body.stock_level);
    const oldStock = Number(oldProduct.stock_level);
    if (newStock !== oldStock) {
      await InventoryHistory.log(id, oldStock, newStock);
      await checkAndTriggerAlert(id, req.body.product_name, req.body.sku, newStock, Number(req.body.reorder_level));
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const rows = await Product.delete(req.params.id);
    if (!rows) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  productValidation,
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
