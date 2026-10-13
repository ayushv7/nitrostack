import { Module } from "@nitrostack/core";
import { SubstitutionService } from "./substitution.service.js";
import { SubstitutionTools } from "./substitution.tools.js";

@Module({
  name: "ingredient-substitution",
  description: "Suggest ingredient substitutions",
  providers: [
    SubstitutionService,
    SubstitutionTools
  ]
})
export class SubstitutionModule {}