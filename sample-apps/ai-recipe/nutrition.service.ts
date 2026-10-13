import { Injectable } from "@nitrostack/core";

@Injectable()
export class NutritionService {

    private nutritionData: Record<string, any> = {

        apple: {
            calories: 52,
            protein: "0.3 g",
            carbs: "14 g",
            fat: "0.2 g",
            fiber: "2.4 g"
        },

        banana: {
            calories: 89,
            protein: "1.1 g",
            carbs: "23 g",
            fat: "0.3 g",
            fiber: "2.6 g"
        },

        rice: {
            calories: 130,
            protein: "2.7 g",
            carbs: "28 g",
            fat: "0.3 g",
            fiber: "0.4 g"
        },

        chicken: {
            calories: 239,
            protein: "27 g",
            carbs: "0 g",
            fat: "14 g",
            fiber: "0 g"
        },

        egg: {
            calories: 155,
            protein: "13 g",
            carbs: "1.1 g",
            fat: "11 g",
            fiber: "0 g"
        },

        milk: {
            calories: 42,
            protein: "3.4 g",
            carbs: "5 g",
            fat: "1 g",
            fiber: "0 g"
        },

        paneer: {
            calories: 265,
            protein: "18 g",
            carbs: "1.2 g",
            fat: "20 g",
            fiber: "0 g"
        },

        oats: {
            calories: 389,
            protein: "17 g",
            carbs: "66 g",
            fat: "7 g",
            fiber: "10 g"
        }
    };

    getNutrition(food: string) {

        const key = food.toLowerCase();

        if (!this.nutritionData[key]) {

            return {
                success: false,
                message: "Food item not found."
            };
        }

        return {
            success: true,
            food,
            nutrition: this.nutritionData[key]
        };
    }

    getAllFoods() {

        return Object.keys(this.nutritionData);
    }
}