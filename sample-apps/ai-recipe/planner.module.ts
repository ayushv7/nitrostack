import { Module } from "@nitrostack/core";

import { PlannerService } from "./planner.service.js";
import { PlannerTools } from "./planner.tools.js";

@Module({
    name: "meal-planner",
    description: "Generate meal plans",

    providers: [
        PlannerService
    ],

    controllers: [
        PlannerTools
    ]
})
export class PlannerModule {}