import {
    ToolDecorator as Tool,
    Injectable,
    ExecutionContext,
    z,
} from "@nitrostack/core";

import { RecipeService } from "./recipe.service.js";

const SearchRecipeSchema = z.object({
    recipeName: z.string().describe("Recipe name"),
});

const SearchIngredientSchema = z.object({
    ingredient: z.string().describe("Ingredient name"),
});

const SearchIngredientsSchema = z.object({
    ingredients: z.array(z.string()).describe("List of ingredients"),
});

const RecipeIdSchema = z.object({
    id: z.number().describe("Recipe ID"),
});

const TopRecipeSchema = z.object({
    limit: z.number().default(10),
});

@Injectable({ deps: [RecipeService] })
export class RecipeTools {

    constructor(
        private readonly recipeService: RecipeService
    ) {}

    @Tool({
        name: "search_recipe",
        description: "Search recipes by recipe name",
        inputSchema: SearchRecipeSchema,
    })
    async searchRecipe(
        args: z.infer<typeof SearchRecipeSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Searching recipe", args);

        return await this.recipeService.searchRecipeByName(
            args.recipeName
        );
    }

    @Tool({
        name: "search_ingredient",
        description: "Find recipes using an ingredient",
        inputSchema: SearchIngredientSchema,
    })
    async searchIngredient(
        args: z.infer<typeof SearchIngredientSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Searching ingredient", args);

        return await this.recipeService.searchByIngredient(
            args.ingredient
        );
    }

    @Tool({
        name: "search_multiple_ingredients",
        description: "Find recipes containing multiple ingredients",
        inputSchema: SearchIngredientsSchema,
    })
    async searchIngredients(
        args: z.infer<typeof SearchIngredientsSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Searching ingredients", args);

        return await this.recipeService.searchMultipleIngredients(
            args.ingredients
        );
    }

    @Tool({
        name: "get_recipe",
        description: "Get recipe by ID",
        inputSchema: RecipeIdSchema,
    })
    async getRecipe(
        args: z.infer<typeof RecipeIdSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Getting recipe", args);

        return await this.recipeService.getRecipeById(
            args.id
        );
    }

    @Tool({
        name: "get_all_recipes",
        description: "Return all recipes",
        inputSchema: z.object({}),
    })
    async getAllRecipes(
        _: {},
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Getting all recipes");

        return await this.recipeService.getAllRecipes();
    }

    @Tool({
        name: "random_recipe",
        description: "Return one random recipe",
        inputSchema: z.object({}),
    })
    async randomRecipe(
        _: {},
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Random recipe");

        return await this.recipeService.getRandomRecipe();
    }

    @Tool({
        name: "top_recipes",
        description: "Return top recipes",
        inputSchema: TopRecipeSchema,
    })
    async topRecipes(
        args: z.infer<typeof TopRecipeSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Top recipes", args);

        return await this.recipeService.getTopRecipes(
            args.limit
        );
    }
}