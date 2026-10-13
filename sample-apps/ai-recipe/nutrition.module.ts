import { Module } from "@nitrostack/core";

import { NutritionService } from "./nutrition.service.js";
import { NutritionTools } from "./nutrition.tools.js";

@Module({
    name: "nutrition",
    description: "Nutrition Information Module",

    providers: [
        NutritionService
    ],

    controllers: [
        NutritionTools
    ]
})
export class NutritionModule {}