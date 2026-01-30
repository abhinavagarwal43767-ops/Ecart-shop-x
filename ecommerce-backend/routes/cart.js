const router = require('express').Router();
const auth = require('../middleware/authMiddleware.js');
const { getCart, addToCart, removeFromCart, sendOrderConfirmation } = require('../controllers/cart.controller');

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.delete('/remove/:productId', auth, removeFromCart);

// Order / Send Email
router.post('/confirm', sendOrderConfirmation);

module.exports = router;
