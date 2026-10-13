import { Injectable } from "@nitrostack/core";

@Injectable()
export class SubstitutionService {

  private substitutions: Record<string, string[]> = {
    butter: [
      "Olive Oil",
      "Coconut Oil",
      "Margarine"
    ],

    milk: [
      "Almond Milk",
      "Soy Milk",
      "Oat Milk"
    ],

    egg: [
      "Flaxseed Meal",
      "Mashed Banana",
      "Chia Seeds"
    ],

    sugar: [
      "Honey",
      "Maple Syrup",
      "Jaggery"
    ],

    flour: [
      "Whole Wheat Flour",
      "Oat Flour",
      "Almond Flour"
    ],

    cheese: [
      "Paneer",
      "Tofu",
      "Nutritional Yeast"
    ],

    rice: [
      "Quinoa",
      "Cauliflower Rice"
    ],

    cream: [
      "Greek Yogurt",
      "Coconut Cream"
    ]
  };

  getSubstitutes(ingredient: string) {

    const key = ingredient.toLowerCase();

    return {
      ingredient,
      substitutes:
        this.substitutions[key] ??
        ["No substitute available."]
    };
  }
}