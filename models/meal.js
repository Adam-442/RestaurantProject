/* This file is to get nutrition only,
 other functions have been discarded. */

const meals = require('../meals.json');

function getMealNutrition(givenID) {
    for (i = 0; i < meals.length; i++)
        if (meals[i].id == givenID)
            return meals[i].nutrition;
}

module.exports = {getMealNutrition};