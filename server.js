// config express
const express = require('express');
const app = express();
const port = 5500;

// config nunjucks
const nunjucks = require('nunjucks');

// config Cookie Parser
const cookies = require("cookie-parser");
app.use(cookies());

// config multer
const multer = require('multer')
const upload = multer({ dest: 'public/reviewImages' })

app.use(express.static(__dirname + '/public'));
app.use(express.json())

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

const meal_router = require("./routers/meal_router");
app.get('/', meal_router);
app.get('/detail/:mealId', meal_router);
app.get('/:mealId/reviews', meal_router);
app.post('/:mealId/reviews', meal_router);

const sales_router = require("./routers/sales_router");
app.get('/sales/cart', sales_router);
app.get('/sales/order', sales_router);

app.listen(port, function() {
    console.log("Server is working on port: ",port);
});