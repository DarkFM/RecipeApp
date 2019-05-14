import Modal from './modal.js';

let meals = []; // global need by evenetListener function
function work(ev) {
    const topParent = ev.target.closest('.recipe-item');
    if (topParent) {
        const id = topParent.dataset.id;
        const obj = meals.find(obj => obj.id === id);
        loadModal(obj.meal);
    }
}

export function addEventListeners(mealsRef) {
    meals = mealsRef;
    const doc = document;
    // need same ref of function to match signature
    doc.removeEventListener('click', work, false);
    doc.addEventListener('click', work, false);
}

export function createMealNode(meal) {
    const select = (element = document) => cssSelector => element.querySelector(cssSelector);
    const template = select()('#recipe-item-template');
    // clone the template's content element
    const recipeItem = document.importNode(template.content, true);
    const recipeItemSelect = select(recipeItem);

    // populate the DOM element
    recipeItemSelect('.recipe-item').dataset.id = meal.id;
    recipeItemSelect('.recipe-item__img-container img').src = meal.thumbnail;
    recipeItemSelect('.recipe-item__title').innerText = meal.name;
    recipeItemSelect('.recipe-item__description').innerText = `This ${meal.category} dish orginates from ${meal.origin}`;
    recipeItemSelect('.prepTime').innerText = meal.preperationTime;
    recipeItemSelect('.totalServe').innerText = meal.totalServing;
    recipeItemSelect('.difficulty').innerText = meal.difficulty;

    return recipeItem;
}

export function loadModal(meal) {
    const template = document.getElementById('modal-template');
    const modalClone = document.importNode(template.content, true);
    const config = {
        DOMNode: modalClone.querySelector('#modal'),
        parentElement: document.querySelector('#modal-container'),
        options: [
            { selector: '#modal-img img', nodeProperty: 'src', value: meal.thumbnail },
            { selector: '.modal-title', nodeProperty: 'innerText', value: meal.name },
            { selector: '.modal-servings-size', nodeProperty: 'innerText', value: meal.totalServing },
            { selector: '.modal-completion-time', nodeProperty: 'innerText', value: meal.preperationTime },
            { selector: '.modal-directions', nodeProperty: 'innerHTML', value: lisFromInstructions(meal.instructionsArray) },
            { selector: '.modal-ingredients', nodeProperty: 'innerHTML', value: lisFromIngredientsMap(meal.ingredientMeasureMap) },
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