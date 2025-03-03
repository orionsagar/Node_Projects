const express = require('express');
const path = require('path');

//const rootDir = require('../util/path');

const router = express.Router();

/// Controller
const adminController = require('../controllers/admin');


// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getProducts);


// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;


/// for export product
// exports.routes = router;
// exports.products = products;