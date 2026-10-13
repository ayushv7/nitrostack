var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Widget, Injectable } from '@nitrostack/core';
import { InnovationScoreService } from '../services/innovationScore.service.js';
import { z } from 'zod';
import { UnderstandIdeaOutputSchema } from '../types/idea.types.js';
import { CompetitorProfileSchema } from '../types/profile.types.js';
import { MarketGapAnalysisOutputSchema } from '../types/pipeline.types.js';
export const InnovationScoringInputSchema = z.object({
    ideaAnalysis: UnderstandIdeaOutputSchema.optional(),
    profiles: z.array(CompetitorProfileSchema).optional().catch([]),
    marketGaps: MarketGapAnalysisOutputSchema.optional()
});
function pipelineWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let InnovationScoringTools = class InnovationScoringTools {
    scoreService;
    constructor(scoreService) {
        this.scoreService = scoreService;
    }
    async scoreInnovation(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: innovation_scoring] Started', { input: JSON.stringify(args) });
        try {
            const parseResult = InnovationScoringInputSchema.safeParse(args);
            const input = parseResult.success ? parseResult.data : {};
            const defaultIdea = {
                category: 'Startup SaaS',
                coreProblem: 'Unaddressed market problem',
                targetAudience: 'Target Customers',
                valueProposition: 'Value prop solution',
                keywords: ['SaaS']
            };
            const ideaAnalysis = input.ideaAnalysis || defaultIdea;
            const profiles = input.profiles || [];
            const marketGaps = input.marketGaps || { gaps: [], unaddressedProblems: [], whitespaceOpportunities: [] };
            const result = await this.scoreService.scoreInnovation(ideaAnalysis, profiles, marketGaps);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: innovation_scoring] Completed', { overallScore: result.overallScore, durationMs: duration });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMsg = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: innovation_scoring] Failed', { error: errorMsg, durationMs: duration });
            return {
                overallScore: 80,
                dimensionScores: { problemUniqueness: 80, marketTiming: 80, moatPotential: 80, executionFeasibility: 80 },
                recommendations: [],
                riskFactors: [],
                status: 'error',
                error: errorMsg
            };
        }
    }
};
__decorate([
    Tool({
        name: 'innovation_scoring',
        description: 'Calculate innovation index and potential scores across market dimensions.',
        inputSchema: InnovationScoringInputSchema,
    }),
    Widget(pipelineWidget('pipeline-progress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InnovationScoringTools.prototype, "scoreInnovation", null);
InnovationScoringTools = __decorate([
    Injectable({ deps: [InnovationScoreService] }),
    __metadata("design:paramtypes", [InnovationScoreService])
], InnovationScoringTools);
export { InnovationScoringTools };
//# sourceMappingURL=innovation_scoring.tools.js.map