import {
    ToolDecorator as Tool,
    Injectable,
    ExecutionContext,
    z,
} from "@nitrostack/core";

import { NutritionService } from "./nutrition.service.js";

const NutritionSchema = z.object({
    food: z.string().describe("Food name"),
});

@Injectable({ deps: [NutritionService] })
export class NutritionTools {

    constructor(
        private readonly nutritionService: NutritionService
    ) {}

    @Tool({
        name: "nutrition_info",
        description: "Get nutrition information of a food.",
        inputSchema: NutritionSchema,
    })
    async nutritionInfo(
        args: z.infer<typeof NutritionSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Nutrition Search", args);

        return this.nutritionService.getNutrition(
            args.food
        );
    }

    @Tool({
        name: "list_foods",
        description: "Return all supported food items.",
        inputSchema: z.object({}),
    })
    async listFoods(
        _: {},
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Listing foods");

        return this.nutritionService.getAllFoods();
    }
}