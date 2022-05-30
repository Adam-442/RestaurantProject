const model_meal = require('../models/meal_db')

// config express
const express = require('express');
const { sum } = require('nunjucks/src/filters');
const router = express.Router();

// config multer
const multer = require('multer')
const upload = multer({ dest: 'public/reviewImages' })

function check_cookies(req, res, next) {
    // check if has a recent bought or not
    recent_bought = [];
    if (req.cookies.recent_bought) {
        prev_cart_items = JSON.parse(req.cookies.recent_bought);
        for (const [key, value] of Object.entries(prev_cart_items)) {
            recent_bought.push(model_meal.getMealById(key))
        }
    }
    res.locals.recent_bought = recent_bought;
    next();
}

function get_cart(req, res, next) {
    cart_items = {};
    total_price = 0;
    number_of_items = 0;
    if (req.cookies.cart) {
        cart_items = JSON.parse(req.cookies.cart);
        // Replace {id:count} with {id:[meal, count]}
        for (const [key, value] of Object.entries(cart_items)) {
            meal = model_meal.getMealById(key);
            cart_items[key] = [meal, value];
            total_price += Number(meal.price);
            number_of_items += value;
        }
    }
    // Send variables to page
    res.locals.cart_items = cart_items;
    res.locals.total_price = total_price;
    res.locals.number_of_items = number_of_items;
    next();
}

function indexLoader(req, res, next) {
    meals_array = model_meal.getAllMeals();
    meals_array.forEach(meal => {
        meal.rating = countRate(meal.id);
    });

    next();
}

router.get('/', [check_cookies, get_cart, indexLoader], (req, res) => {
    res.render('index.njk', { meals: meals_array });
})

function countRate(id){
    review_list = model_meal.getMealReviews(id);
    // count the rate
    rate = 0;
    if (review_list.length != 0) {
        let sum = 0;
        
        review_list.forEach(element => {
            sum += Number(element.rating);   
        });
        
        rate = sum / review_list.length;
    }
    return rate;
}

function mealLoader(req, res, next) {
    selected_meal = model_meal.getMealById(req.params.mealId);
    review_list = model_meal.getMealReviews(req.params.mealId);
    has_review = (review_list.length == 0)? false: true;
    rate = countRate(req.params.mealId);
    next();
}

function showReviews(req ,res) {
    res.redirect('/detail/' + req.body.mealId);
}

router.get('/detail/:mealId', [get_cart, mealLoader], (req, res) => {
    res.render('detail.njk', { meal : selected_meal , review : review_list , rate_value : rate, has_review });
})

router.get('/:mealId/reviews', (req, res) => {
    res.send(JSON.stringify(model_meal.getMealReviews(req.params.mealId)))
})

router.post('/:mealId/reviews', upload.single('image'), function(req, res, next) {
    try {
        req.body.image = (req.file)? req.file.filename: null;
        req.body.mealId = req.params.mealId;
        console.log("req", req.body);
        model_meal.addMealReview(req.body);
        showReviews(req, res)
    } catch(err) {
        console.error(`Error while adding review`, err.message);
        next(err);
    }
});

module.exports = router;