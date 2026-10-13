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
import { MarketGapService } from '../services/marketGap.service.js';
import { z } from 'zod';
import { UnderstandIdeaOutputSchema } from '../types/idea.types.js';
import { CompetitorProfileSchema } from '../types/profile.types.js';
import { CompareCompetitorsOutputSchema } from '../types/comparison.types.js';
export const MarketGapAnalysisInputSchema = z.object({
    ideaAnalysis: UnderstandIdeaOutputSchema.optional(),
    profiles: z.array(CompetitorProfileSchema).optional().catch([]),
    comparison: CompareCompetitorsOutputSchema.optional()
});
function pipelineWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let MarketGapAnalysisTools = class MarketGapAnalysisTools {
    marketGapService;
    constructor(marketGapService) {
        this.marketGapService = marketGapService;
    }
    async analyzeMarketGaps(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: market_gap_analysis] Started', { input: JSON.stringify(args) });
        try {
            const parseResult = MarketGapAnalysisInputSchema.safeParse(args);
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
            const comparison = input.comparison || { marketLeader: 'Incumbent' };
            const result = await this.marketGapService.analyzeGaps(ideaAnalysis, profiles, comparison);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: market_gap_analysis] Completed', { gapsCount: result.gaps.length, durationMs: duration });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMsg = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: market_gap_analysis] Failed', { error: errorMsg, durationMs: duration });
            return {
                gaps: [],
                unaddressedProblems: [],
                whitespaceOpportunities: [],
                status: 'error',
                error: errorMsg
            };
        }
    }
};
__decorate([
    Tool({
        name: 'market_gap_analysis',
        description: 'Analyze unaddressed market gaps, customer pain points, and whitespace opportunities.',
        inputSchema: MarketGapAnalysisInputSchema,
    }),
    Widget(pipelineWidget('pipeline-progress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketGapAnalysisTools.prototype, "analyzeMarketGaps", null);
MarketGapAnalysisTools = __decorate([
    Injectable({ deps: [MarketGapService] }),
    __metadata("design:paramtypes", [MarketGapService])
], MarketGapAnalysisTools);
export { MarketGapAnalysisTools };
//# sourceMappingURL=market_gap_analysis.tools.js.map