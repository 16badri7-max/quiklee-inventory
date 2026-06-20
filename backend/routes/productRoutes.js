const express = require('express');
const router = express.Router();
const {
  productValidation,
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { validate } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Apply auth middleware to all product routes
router.use(auth);

router.post('/', productValidation, validate, createProduct);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', productValidation, validate, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
