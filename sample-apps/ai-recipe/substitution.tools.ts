import {
    ToolDecorator as Tool,
    Injectable,
    ExecutionContext,
    z,
} from "@nitrostack/core";

import { SubstitutionService } from "./substitution.service.js";

const SubstitutionSchema = z.object({
    ingredient: z.string().describe("Ingredient name"),
});

@Injectable({ deps: [SubstitutionService] })
export class SubstitutionTools {

    constructor(
        private readonly substitutionService: SubstitutionService
    ) {}

    @Tool({
        name: "ingredient_substitution",
        description: "Suggest substitute ingredients.",
        inputSchema: SubstitutionSchema,
    })
    async ingredientSubstitution(
        args: z.infer<typeof SubstitutionSchema>,
        ctx: ExecutionContext
    ) {

        ctx.logger.info("Finding substitutions", args);

        return this.substitutionService.getSubstitutes(
            args.ingredient
        );
    }
}