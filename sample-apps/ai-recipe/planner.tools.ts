import {
    ToolDecorator as Tool,
    Injectable,
    ExecutionContext,
    z,
} from "@nitrostack/core";

import { PlannerService } from "./planner.service.js";

const MealPlanSchema = z.object({
    days: z.number().min(1).max(30).describe("Number of days"),
    diet: z
        .enum(["veg", "non-veg", "vegan"])
        .describe("Diet type"),
});

@Injectable({ deps: [PlannerService] })
export class PlannerTools {

    constructor(
        private readonly plannerService: PlannerService
    ) {}

    @Tool({
        name: "generate_meal_plan",
        description: "Generate a meal plan based on diet type and number of days.",
        inputSchema: MealPlanSchema,
    })
    async generateMealPlan(
        args: z.infer<typeof MealPlanSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Generating meal plan", args);

        return this.plannerService.generatePlan(
            args.days,
            args.diet
        );
    }
}