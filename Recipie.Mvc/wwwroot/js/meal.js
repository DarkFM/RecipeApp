export default class Meal {

    constructor(meal) {
        this.startTime = Date.now(); // gets number of milliseconds since Jan 1, 1970 00:00:00 UTC
        this.id = meal['idMeal'];
        this.name = meal['strMeal'];
        this.drinkAlternate = meal['strDrinkAlternate'];
        this.category = meal['strCategory'];
        this.origin = meal['strArea'];
        this.instructions = meal['strInstructions'];
        this.thumbnail = meal['strMealThumb'];
        this.source = meal['strSource'];
        this.instructionsArray = this.instructions
            .replace(/[()]/ig, '') // removes parenteses from the sring
            .split(/(?:\d.\r\n)+|(?:\r\n)/g) // splits on a new line
            .reduce((resultArry, current) => (resultArry.push(...current.split('.')), resultArry), []) // split each str into sentences and concatenate to array
            .filter(str => str.trim() && str.length > 2) // remove empty strings
            .map(str => str.trim());

        const objProps = Object.keys(meal);
        const ingredients = objProps.filter(prop => prop.includes('Ingredient'));
        const measures = objProps.filter(prop => prop.includes('Measure'));

        // maps the ingredients to their require measures for this recipe
        this.ingredientMeasureMap = ingredients.reduce((resultMap, currProperty, currIndex) => {
            // check that the property contains non empty string
            if (!meal[currProperty])
                return resultMap;

            const ingredientName = meal[currProperty];
            const ingredientMeasure = meal[measures[currIndex]];
            resultMap[ingredientName] = ingredientMeasure;

            return resultMap;
        }, {});
    }

    get preperationTime() {
        const re = new RegExp(/(\d+[ /\d]+)(mins?(?:utes?)?|secs?(?:onds?)?|hr|hours?|days?)/, 'igm');
        const dayCheck = /days?/i;
        const hrCheck = /hr|hours?/i;
        const minCheck = /mins?(?:utes?)?/i;
        const secCheck = /secs?(?:onds?)?/i;

        const oneDayDelta = 86400000;
        const oneHourDelta = 3600000;
        const oneMinuteDelta = 60000;
        const oneSecondDelta = 1000;

        let matches = [];

        // DateTime used to sum up the total cooking time
        const time = new Date(this.startTime);

        while ((matches = re.exec(this.instructions)) !== null) {
            // convert any fractions to decimal
            const normalizedNumber = matches[1].replace(/(\d)\/(\d)/ig, (match, numerator, denominator) => {
                return (parseInt(numerator) / parseInt(denominator)).toFixed(2);
            });
            // add up the numbers to get total time
            const normalizedTime = normalizedNumber
                .split(' ')
                .filter(x => x)
                .reduce((prev, curr) => parseFloat(prev) + parseFloat(curr), 0);

            const timeType = matches[2];

            // keep adding the time to time object
            if (dayCheck.test(timeType)) {
                time.setTime(time.getTime() + oneDayDelta * normalizedTime);
            } else if (hrCheck.test(timeType)) {
                time.setTime(time.getTime() + oneHourDelta * normalizedTime);
            } else if (minCheck.test(timeType)) {
                time.setTime(time.getTime() + oneMinuteDelta * normalizedTime);
            } else if (secCheck.test(timeType)) {
                time.setTime(time.getTime() + oneSecondDelta * normalizedTime);
            }
        }

        const timeDelta = time.getTime() - this.startTime;
        const newTime = new Date(timeDelta);

        if (timeDelta >= oneDayDelta) {
            return `${Math.trunc(timeDelta / oneDayDelta)} day(s)`;
        } else if (timeDelta > oneHourDelta) {
            let baseStr = `${newTime.getUTCHours()} hr(s)`;
            if (newTime.getMinutes() > 0)
                baseStr += ` ${newTime.getUTCMinutes()} min(s)`;

            return baseStr;
        } else if (timeDelta > oneMinuteDelta) {
            return `${newTime.getUTCMinutes()} min(s)`;
        } else {
            return '10 min(s)';
        }
    }

    get totalServing() {
        return Math.round(Math.random() * 4 + 1);
    }

    get difficulty() {
        const totalInstructions = this.instructionsArray.length;
        const totalIngredients = Object.keys(this.ingredientMeasureMap).length;

        let totalPoints = 0;
        if (totalInstructions >= 20) {
            totalPoints += 5;
        } else if (totalInstructions >= 13) {
            totalPoints += 3;
        } else {
            totalPoints += 1;
        }

        if (totalIngredients >= 12) {
            totalPoints += 5;
        } else if (totalIngredients >= 6) {
            totalPoints += 3;
        } else {
            totalPoints += 1;
        }

        return totalPoints >= 8 ? 'Hard'
            : totalPoints >= 5 ? 'Medium'
            : 'Easy';

    }
}

