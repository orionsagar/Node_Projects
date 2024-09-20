// const bodyParser = require('body-parser');
// // use for array
// //const products = [];

// //for saving data in file
// const fs = require('fs');
// const path = require('path');

// const Cart = require('./cart');


// /// Database Connection
// const db = require('../util/database');


// module.exports = class Product {
//     constructor(id, title, imageurl, price, description) {
//         this.id = id;
//         this.title = title;
//         this.imageurl = imageurl;
//         this.price = price;
//         this.description = description;
//     }

//     save() {
//         return db.execute('Insert into products (title, price, imageurl, description) Values (?, ?, ?, ?)',
//             [this.title, this.price, this.imageurl, this.description]
//         );
//     }

//     static deleteById(id) {
//         return db.execute('Del from Products where products.id = ?', [id]);
//     }



//     static fetchAll() {
//         return db.execute('Select * from Products');
//     }


//     static findById(id) {
//         return db.execute('Select * from Products where products.id = ?', [id]);
//     }
// };


/// Sequelize
const { Model } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;