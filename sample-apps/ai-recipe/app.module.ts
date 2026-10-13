import { McpApp, Module, ConfigModule } from "@nitrostack/core";

import { RecipeModule } from "./recipe/recipe.module.js";
import { SubstitutionModule } from "./substitution/substitution.module.js";
import { PlannerModule } from "./planner/planner.module.js";
import { NutritionModule } from "./nutrition/nutrition.module.js";

@McpApp({
  module: AppModule,
  server: {
    name: "ai-recipe-assistant",
    version: "1.0.0"
  },
  logging: {
    level: "info"
  }
})

@Module({
  name: "ai-recipe-assistant",
  description: "AI Recipe Assistant MCP Server",

  imports: [
    ConfigModule.forRoot(),
    PlannerModule,
    RecipeModule,
    NutritionModule,
    SubstitutionModule
  ]
})

export class AppModule {}