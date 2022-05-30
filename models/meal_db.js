const db = require('better-sqlite3')('reviews.db');
const model_meal = require('./meal');

function getAllMeals(){
    const res = db.prepare('select * from meals;').all();
    return res;
}

function getMealById(givenID){
    const res = db.prepare(`select * from meals where id = ${givenID};`).get();
    res.nutrition = model_meal.getMealNutrition(givenID);
    return res;
}

// needs to check
function getMealReviews(meal_id){
    const res = db.prepare(`select * from reviews where meal_id = ${meal_id};`).all();
    return res;
}

function getNull(string) {
    if (!string) {
       return null;
    }
    return string;
 }

function validReview(review) {
    if (!review) {
        let error = new Error("No object is provided");
        error.statusCode = 400;
    
        throw error;
    }

    let data = {
        reviewer_name: review.reviewer_name,
        city: getNull(review.city),
        date: new Date().toLocaleString(),
        rating: Number(review.rating)/20,
        image: review.image,
        review: review.review,
        meal_id: review.mealId
    };

    return data;
}

function addMealReview(review) {
    review = validReview(review);
    const insert = db.prepare('INSERT INTO reviews (reviewer_name, city, "date", rating, image, review, meal_id) VALUES (@reviewer_name, @city, @date, @rating, @image, @review, @meal_id)');
    const result = insert.run(review);
    
    let message = 'Error in creating review';
    if (result.changes) {
      message = 'Review created successfully';
    }
    
    console.log(message);
    return {message};
}

module.exports = {getAllMeals, getMealById, getMealReviews, addMealReview}