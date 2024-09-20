/// From Model
const Product = require('../models/product');

/// For GET
exports.getAddProduct = (req, res, next) => {
    console.log('In Add Product middelware');


    /// For ejs
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formCSS: true,
        productCSS: true,
        editing: false,
    }); // ejs
};


/// For POST
exports.postAddProduct = (req, res, next) => {
    console.log('from Post: ' + req.body.title);
    console.log('from Post: ' + req.body.imageUrl);
    console.log('from Post: ' + req.body.price);
    console.log('from Post: ' + req.body.description);

    // products.push({
    //     title: req.body.title
    // });


    /// From Model
    const title = req.body.title;
    const imageurl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    /// For Sequelize
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageurl,
    //     description: description,
    //     userId: req.user.id
    // })

    req.user.createProduct({
            title: title,
            price: price,
            imageUrl: imageurl,
            description: description,
        })
        .then(result => {
            console.log('Create Product');
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        });


    /// For Mysql
    // const product = new Product(null, title, imageurl, price, description);
    // product
    // .save()
    // .then(() => {
    //   res.redirect('/');
    // })
    // .catch(err => console.log(err));

    //res.redirect('/pug');

};


exports.getProducts = (req, res, next) => {
    //Product.findAll()
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                docTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));

    /// From Mysql Model
    // Product.fetchAll(products => {
    //     res.render('admin/products', {
    //         prods: products,
    //         docTitle: 'Admin Products',
    //         path: '/admin/products'
    //     });
    // });
};




exports.getEditProduct = (req, res, next) => {
    console.log("edit page");
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }

    const prodId = req.params.productId;
    //Product.findByPk(prodId)
    req.user.getProducts({
            where: {
                id: prodId
            }
        })
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err));


    // Product.findById(prodId, product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', {
    //         docTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         editing: editMode,
    //         product: product
    //     });
    // });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updateTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    // const updatedProduct = new Product(
    //     prodId,
    //     updateTitle,
    //     updatedImageUrl,
    //     updatedPrice,
    //     updatedDescription
    // );

    Product.findByPk(prodId)
        .then(product => {
            product.title = updateTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return product.save();
        })
        .then(result => {
            console.log('Update Product!');
        })
        .catch(err => console.log(err));

    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('Destroyed Product');
        })
        .catch(err => console.log(err));
    //Product.deleteById(prodId);
    res.redirect('/admin/products');
};