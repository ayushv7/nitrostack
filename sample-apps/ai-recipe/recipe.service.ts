import { Injectable } from "@nitrostack/core";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export interface Recipe {
    id: number;
    title: string;
    ingredients: string[];
    directions: string[];
    source: string;
    link: string;
}

@Injectable()
export class RecipeService {

    private recipes: Recipe[] = [];
    private loaded = false;

    async loadRecipes(): Promise<void> {

        if (this.loaded) return;

        const csvPath = path.join(process.cwd(), "data", "RecipeNLG.csv");

        if (!fs.existsSync(csvPath)) {
            throw new Error(`Recipe dataset not found: ${csvPath}`);
        }

        return new Promise((resolve, reject) => {

            let id = 1;

            fs.createReadStream(csvPath)
                .pipe(csv())
                .on("data", (row: any) => {

                    this.recipes.push({
                        id: id++,
                        title: row.title ?? "",
                        ingredients: row.ingredients
                            ? row.ingredients
                                  .split(",")
                                  .map((x: string) => x.trim())
                            : [],
                        directions: row.directions
                            ? row.directions
                                  .split(".")
                                  .map((x: string) => x.trim())
                                  .filter(Boolean)
                            : [],
                        source: row.source ?? "",
                        link: row.link ?? ""
                    });

                })
                .on("end", () => {
                    this.loaded = true;
                    console.log(`✅ Loaded ${this.recipes.length} recipes`);
                    resolve();
                })
                .on("error", reject);

        });
    }

    async getAllRecipes(): Promise<Recipe[]> {
        await this.loadRecipes();
        return this.recipes;
    }

    async getRecipeById(id: number): Promise<Recipe | undefined> {
        await this.loadRecipes();
        return this.recipes.find(recipe => recipe.id === id);
    }

    async searchRecipeByName(name: string): Promise<Recipe[]> {
        await this.loadRecipes();

        const keyword = name.toLowerCase();

        return this.recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(keyword)
        );
    }

    async searchByIngredient(ingredient: string): Promise<Recipe[]> {

        await this.loadRecipes();

        const keyword = ingredient.toLowerCase();

        return this.recipes.filter(recipe =>
            recipe.ingredients.some(item =>
                item.toLowerCase().includes(keyword)
            )
        );
    }

    async searchMultipleIngredients(
        ingredients: string[]
    ): Promise<Recipe[]> {

        await this.loadRecipes();

        const list = ingredients.map(x => x.toLowerCase());

        return this.recipes.filter(recipe =>
            list.every(item =>
                recipe.ingredients.some(i =>
                    i.toLowerCase().includes(item)
                )
            )
        );
    }

    async getRandomRecipe(): Promise<Recipe | undefined> {

        await this.loadRecipes();

        if (this.recipes.length === 0) {
            return undefined;
        }

        const index = Math.floor(Math.random() * this.recipes.length);

        return this.recipes[index];
    }

    async getTopRecipes(limit = 10): Promise<Recipe[]> {

        await this.loadRecipes();

        return this.recipes.slice(0, limit);
    }

    async test(): Promise<void> {

        await this.loadRecipes();

        console.log("Total Recipes:", this.recipes.length);

        if (this.recipes.length > 0) {
            console.log("First Recipe:");
            console.log(this.recipes[0]);
        }

    }

}