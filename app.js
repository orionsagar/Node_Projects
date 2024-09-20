const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');
const db = require('./util/database');

// Model
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

/// Handlebar Templating Engine
// app.engine('hbs', expressHbs({
//     defaultLayout: 'main',
//     extname: '.hbs',
//     layoutsDir: path.join(__dirname, 'views/layouts')
// }));
// app.set('view engine', 'hbs');


/// PUG Templating Engine
// app.set('view engine', 'pug');



/// EJS Templating Engine
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));


/// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const { response } = require('express');


app.use(bodyParser.urlencoded({
    extended: false
}));


/// For Static File Folder
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     console.log('In the middelware');
//     next(); //Allows the request to continue to the next middleware in line
// });


app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});




/// Call Routes for register in app file
//app.use('/admin', adminRoutes.routes); // for exports value by routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);


/// Show Error Page when route page not found.
/// Controller
const errorController = require('./controllers/error');
const {
    use
} = require('./routes/admin');

app.use(errorController.get404);


// app set 
//app.set('views', path.join(__dirname, 'views'));


/// Server Configurations.
const hostname = '127.0.0.1';
const port = process.env.PORT || 1660;

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
});

db
.sync()
    // .sync({
    //     force: true
    // })
    .then(result => {
        return User.findByPk(1);

    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Sagar',
                email: 'test@gmail.com'
            });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(user => {
        console.log(user);
        app.listen(port, hostname, () => {
            console.log(`Server running at ${hostname}:${port}/`)
        });
    })
    .catch(err => {
        console.log(err);
    });