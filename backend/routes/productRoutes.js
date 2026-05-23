const express = require('express');
const router = express.Router();
const {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductById,
} = require('../controllers/productController');

router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
