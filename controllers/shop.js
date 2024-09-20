//const products = [];

/// From Model
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');


// Index
exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'My Shop',
                path: '/'
            });
        }).catch(err => {
            console.log(err);
        });

    /// From Mysql Model
    // Product.fetchAll()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/index', {
    //             prods: rows,
    //             docTitle: 'My Shop',
    //             path: '/'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
};


/// For GET
exports.getProducts = (req, res, next) => {

    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                docTitle: 'All Products',
                path: '/products'
            });
        }).catch(err => {
            console.log(err);
        });


    /// From Mysql Model
    // Product.fetchAll().then(([rows, fieldData]) => {
    //         res.render('shop/product-list', {
    //             prods: rows,
    //             docTitle: 'All Products',
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

};


// Get Products
exports.getDetailsProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findOne({
    //         where: {
    //             id: prodId
    //         }
    //     })
    //     .then(products => {
    //         console.log(products);
    //         res.render('shop/product-details', {
    //             product: products,
    //             docTitle: products.titile,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });

    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-details', {
                product: product,
                docTitle: product.titile,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err)
        });

    /// For Mysql
    // Product.findById(prodId)
    //     .then(([product]) => {
    //         res.render('shop/product-details', {
    //             product: product[0],
    //             docTitle: product.titile,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     });


};



// Cart
exports.getCart = (req, res, next) => {
    //console.log(req.user.cart);
    req.user.getCart()
        .then(cart => {
            //console.log(cart);
            return cart.getProducts().then(products => {
                res.render('shop/cart', {
                    docTitle: 'Your Cart',
                    path: '/cart',
                    products: products
                });
            }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));

};


exports.getPostCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodId
                }
            });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, {
                        through: {
                            quantity: newQuantity
                        }
                    })
                }).catch(err => console.log(err));
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

    // Product.findById(prodId, product => {
    //     Cart.addProduct(prodId, product.price);
    //     res.redirect('/cart');
    // });
};




exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('Products: ' + prodId);

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: prodId
                }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};



// Checkout
exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    });
};


exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProduct(
                        products.map(product => {
                            product.orderItem = {
                                quantity: product.cartItem.quantity
                            };
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};


// Checkout
exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({
            include: ['products']
        })
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
};