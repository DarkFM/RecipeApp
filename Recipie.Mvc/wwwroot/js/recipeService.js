﻿const apiKey = '1';
let apiEndpoint = `https://www.themealdb.com/api/json/v1/${apiKey}/`;


export default class RecipeService {

    getMeals(url) {
        if (!url.trim()) {
            throw new Error('Cannot have empty search query');
        }

        const request = new Request(url, {
            method: 'GET'
        });

        return fetch(request)
            .then(response => {
                if (!response.ok) {
                    throw new Error('HTTP error, status = ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (!data) {
                    throw new Error('Invalid data returned');
                    //throw new Error('No meal fround for the specified query');
                }
                return data['meals']; // return all found meals
            })
            .catch(error => {
                console.error(error);
            });
    }

    // returns an array of the found meals
    findRecipesByName(name) {
        let meals;

        const endpoint = apiEndpoint + 'search.php?s=' + name;
        // Get the meals from the API
        this.getMeals(endpoint)
            .then(result => meals = result);

        return meals;
    }

    findRecipeById(id) {
        let meal;

        const endpoint = apiEndpoint + 'lookup.php?i=' + id;
        // Get the meal from the API
        this.getMeals(endpoint)
            .then(result => meals = result);

        return meal;
    }

    getRandomMeals() {
        let meals;

        const endpoint = apiEndpoint + 'random.php';
        // Get the meals from the API
        this.getMeals(endpoint)
            .then(result => meals = result);

        return meals;
    }
}