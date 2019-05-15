import RecipeService from './recipeService.js';
import Meal from './meal.js';
import { addEventListeners, createMealNode } from './utilities.js';

function main() {
    const meals = []; // Array[{meal: mealObj, id: Number}]
    const service = new RecipeService();
    
    // Perform AJAX request and save result
    service.getRandomMeals(4)
        .then(mealsData => mealsData.map(mealData => {
            const meal = new Meal(mealData);
            meals.push({ meal, id: meal.id });
            return meal;
        }))
        .then(meals => meals.map(createMealNode))
        .then(mealNodes => {
            const parentNode = document.querySelector('.recipe-items');
            mealNodes.forEach(mealNode => parentNode.appendChild(mealNode));
        })
        .then(_ => {
            addEventListeners(meals);
        });

    document.getElementById('btn-seeAll').onclick = (ev) => {
        ev.preventDefault();
        document.getElementById('featured-recipes').scrollIntoView({
            behavior: "smooth"
        });
    };
}

document.addEventListener('DOMContentLoaded', main);

