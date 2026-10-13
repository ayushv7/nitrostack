import { Module } from "@nitrostack/core";

import { RecipeService } from "./recipe.service.js";
import { RecipeTools } from "./recipe.tools.js";

@Module({
    name: "recipe",

    description: "AI Recipe Assistant using RecipeNLG Dataset",

    controllers: [
        RecipeTools
    ],

    providers: [
        RecipeService
    ]
})
export class RecipeModule {}