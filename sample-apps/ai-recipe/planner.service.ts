import { Injectable } from "@nitrostack/core";

@Injectable()
export class PlannerService {

    private vegMeals = [
        {
            breakfast: "Oats with Fruits",
            lunch: "Vegetable Biryani",
            dinner: "Paneer Curry with Roti"
        },
        {
            breakfast: "Idli with Sambar",
            lunch: "Veg Fried Rice",
            dinner: "Dal and Chapati"
        },
        {
            breakfast: "Poha",
            lunch: "Rajma Rice",
            dinner: "Mixed Vegetable Curry"
        }
    ];

    private nonVegMeals = [
        {
            breakfast: "Boiled Eggs",
            lunch: "Chicken Biryani",
            dinner: "Grilled Chicken"
        },
        {
            breakfast: "Omelette",
            lunch: "Fish Curry and Rice",
            dinner: "Chicken Soup"
        },
        {
            breakfast: "Egg Sandwich",
            lunch: "Chicken Fried Rice",
            dinner: "Grilled Fish"
        }
    ];

    private veganMeals = [
        {
            breakfast: "Smoothie Bowl",
            lunch: "Quinoa Salad",
            dinner: "Tofu Stir Fry"
        },
        {
            breakfast: "Avocado Toast",
            lunch: "Vegan Pasta",
            dinner: "Vegetable Soup"
        },
        {
            breakfast: "Fruit Salad",
            lunch: "Chickpea Curry",
            dinner: "Brown Rice with Veggies"
        }
    ];

    generatePlan(days: number, diet: string) {

        let meals = this.vegMeals;

        if (diet.toLowerCase() === "non-veg") {
            meals = this.nonVegMeals;
        }

        if (diet.toLowerCase() === "vegan") {
            meals = this.veganMeals;
        }

        const plan = [];

        for (let i = 0; i < days; i++) {

            const meal = meals[i % meals.length];

            plan.push({
                day: `Day ${i + 1}`,
                breakfast: meal.breakfast,
                lunch: meal.lunch,
                dinner: meal.dinner
            });
        }

        return {
            diet,
            totalDays: days,
            mealPlan: plan
        };
    }
}