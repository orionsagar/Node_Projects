const express = require('express');
const path = require('path');

//const rootDir = require('../util/path');

// const adminData = require('./admin');

const router = express.Router();

/// Controller
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
//router.get('/products/delete');
router.get('/products/:productId', shopController.getDetailsProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.getPostCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);
router.get('/checkout', shopController.getCheckout);

module.exports = router;