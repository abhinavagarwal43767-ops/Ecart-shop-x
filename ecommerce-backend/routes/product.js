const router = require('express').Router();
const { getProducts, addProduct } = require('../controllers/product.controller');

router.get('/', getProducts);
router.post('/', addProduct);

module.exports = router;
