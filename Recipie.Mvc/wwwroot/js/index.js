import RecipeService from './recipeService.js';
import Meal from './meal.js';
import Modal from './modal.js';

function main() {
    const meals = []; // Array[{meal: mealObj, id: Number}]
    const service = new RecipeService();

    // Perform AJAX request and save result
    service.getRandomMeals(6)
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
}

function addEventListeners(meals) {
    // Event for clicking a recipe item
    // this loads the modal
    document.addEventListener('click', ev => {
        const topParent = ev.target.closest('.recipe-item');
        if (topParent) {
            console.log(topParent);
            const id = topParent.dataset.id;
            const obj = meals.find(obj => obj.id === id);
            loadModal(obj.meal);
        }
    }, false);
}

function createMealNode(meal) {
    const select = (element = document) => cssSelector => element.querySelector(cssSelector);
    const template = select()('#recipe-item-template');
    // clone the template's content element
    const recipeItem = document.importNode(template.content, true);
    const recipeItemSelect = select(recipeItem);

    // populate the DOM element
    //const meal = new Meal(data);
    console.log(meal);
    //recipeItemSelect('.recipe-link').href = meal.source;
    recipeItemSelect('.recipe-item').dataset.id = meal.id;
    recipeItemSelect('.recipe-item__img-container img').src = meal.thumbnail;
    recipeItemSelect('.recipe-item__title').innerText = meal.name;
    recipeItemSelect('.recipe-item__description').innerText = `This ${meal.category} dish orginates from ${meal.origin}`;
    recipeItemSelect('.prepTime').innerText = meal.preperationTime;
    recipeItemSelect('.totalServe').innerText = meal.totalServing;
    recipeItemSelect('.difficulty').innerText = meal.difficulty;

    return recipeItem;
}

function loadModal(meal) {
    const template = document.getElementById('modal-template');
    const modalClone = document.importNode(template.content, true);
    const config = {
        DOMNode: modalClone.querySelector('#modal'),
        parentElement: document.querySelector('#modal-container'),
        options: [
            { selector: '.modal-title', nodeProperty: 'innerText', value: meal.name },
            { selector: '.modal-servings-size', nodeProperty: 'innerText', value: meal.totalServing },
            { selector: '.modal-completion-time', nodeProperty: 'innerText', value: meal.preperationTime },
            { selector: '.modal-ingredients', nodeProperty: 'innerHTML', value: lisFromIngredientsMap(meal.ingredientMeasureMap) },
            { selector: '.modal-directions', nodeProperty: 'innerHTML', value: lisFromInstructions(meal.instructionsArray) },
            { selector: '#modal-img img', nodeProperty: 'src', value: meal.thumbnail }
        ]
    };

    const modal = new Modal(config);
    modal.populateNode()
        .showModal();

    // returns a string of li's to add to HTML
    function lisFromIngredientsMap(ingredientMeasure) {
        let listItemsStr = '';
        for (var ingredient in ingredientMeasure) {
            const li = document.createElement('li');
            li.classList.add('modal-ingredient');
            li.textContent = `${ingredient} - ${ingredientMeasure[ingredient]}`;
            listItemsStr += li.outerHTML;
        }

        return listItemsStr;
    }

    function lisFromInstructions(instructionsArray) {
        return instructionsArray.reduce((result, currVal) => {
            const li = document.createElement('li');
            li.classList.add('modal-direction');
            li.textContent = currVal;

            return result + li.outerHTML;
        }, '');
    }

}

document.addEventListener('DOMContentLoaded', main);

