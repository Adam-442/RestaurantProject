const model_meal = require('../models/meal_db')

// config express
const express = require('express');
const router = express.Router();

// local Cart variables
let cart_items = {};
let cookie_list = [];

function check_cookies(req, res, next) {
    if (req.cookies.cart) {
        cart_items = JSON.parse(req.cookies.cart);
    }
    if (req.cookies.cookie_list) {
        cookie_list = JSON.parse(req.cookies.cookie_list);
    }
    next();
}

function add_to_cart(req, res, next) {
    // when adding from index page there will not be a count parameter, So default it to one.
    let count = (req.query.count == null)? 1: Number(req.query.count);
    let id = req.query.id;

    if (id in cart_items) {
        cart_items[id] = Number(cart_items[id]) + count;
    } else {
        cart_items[id] = count;
    }

    // Update/Create 'cart' cookie
    res.cookie('cart', JSON.stringify(cart_items), { maxAge: 900000, httpOnly: false, withCredentials: true });

    next();  
}

router.get('/sales/cart', [check_cookies, add_to_cart], function(req, res) {
    // redirect to previous page
    res.redirect(req.query.back);
});

// order confirm
router.get('/sales/order', check_cookies, function(req, res) {
    // Append cart items to create a "last bought" cookie.
    res.cookie('recent_bought', JSON.stringify(cart_items), { maxAge: 900000, httpOnly: false, withCredentials: true });
    // Append cart items to the "cart list" cookie.
    cookie_list.push(cart_items);
    res.cookie('cookie_list', JSON.stringify(cookie_list), { maxAge: 900000, httpOnly: false, withCredentials: true });
    // Delete cart and its cookie
    res.clearCookie('cart');
    cart_items = {};
    // redirect to index
    res.redirect('/');
});


module.exports = router;