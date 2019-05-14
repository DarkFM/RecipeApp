import RecipeService from './recipeService.js';
import Meal from './meal.js';
import { addEventListeners, createMealNode } from './utilities.js';


const parentNode = document.querySelector('.recipe-items');
let mealsRef = [];

document.addEventListener("DOMContentLoaded", init);
document.querySelector('#search-bar form').addEventListener('submit', searchMeals);

function init() {
    const queryParams = new URLSearchParams(window.location.search);
    const searchStr = queryParams.get('query');
    document.querySelector('#searchBox').value = searchStr;

    getMealsByName(searchStr);
}

// on form submission
function searchMeals(ev) {
    ev.preventDefault();

    const query = document.querySelector('#searchBox').value;
    const url = new URL(window.location.href);
    url.searchParams.set('query', query);
    window.history.replaceState({}, null, url.href); // replaces entry in history withou loading page

    getMealsByName(query);
}

function getMealsByName(query) {
    getMeals(query)
        .then(meals => {
            mealsRef = meals;
            return meals.map(x => createMealNode(x.meal));
        })
        .then(mealNodes => {
            parentNode.innerHTML = '';
            mealNodes.forEach(mealNode => parentNode.appendChild(mealNode));
        })
        .then(_ => {
            addEventListeners(mealsRef);
        })
        .catch(reason => {
            parentNode.innerHTML = '';
            parentNode.textContent = reason.message;
        });
}

function getMeals(searchStr) {
    const recipeService = new RecipeService();
    const meals = [];

    return recipeService.findRecipesByName(searchStr)
        .then(mealsData => {
            if (!mealsData) {
                throw new Error('No recipes found for the given query');
            }

            mealsData.map(mealData => {
                const meal = new Meal(mealData);
                meals.push({ meal, id: meal.id });
                return meal;
            });
        })
        .then(mealsArry => meals);
}


function updateQueryString(ev) {

}