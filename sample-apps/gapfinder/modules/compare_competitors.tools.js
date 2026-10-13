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
import { CompetitorComparisonService } from '../services/competitorComparison.service.js';
import { CompareCompetitorsInputSchema } from '../types/comparison.types.js';
function comparisonWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let CompareCompetitorsTools = class CompareCompetitorsTools {
    comparisonService;
    constructor(comparisonService) {
        this.comparisonService = comparisonService;
    }
    async compareCompetitors(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: compare_competitors] Execution Started', { input: JSON.stringify(args) });
        try {
            const parseResult = CompareCompetitorsInputSchema.safeParse(args);
            const parsedInput = parseResult.success ? parseResult.data : (args || {});
            const result = await this.comparisonService.compare(parsedInput);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: compare_competitors] Execution Completed', {
                marketLeader: result.marketLeader,
                durationMs: duration
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: compare_competitors] Execution Failed', { error: errorMessage, durationMs: duration });
            return {
                marketLeader: 'N/A',
                summary: 'Comparison failed due to error.',
                topCompetitors: [],
                comparisonTable: [],
                featureMatrix: [],
                status: 'error',
                message: errorMessage
            };
        }
    }
};
__decorate([
    Tool({
        name: 'compare_competitors',
        description: 'Compare competitor profiles across features, pricing, target audience, business model, strengths, and weaknesses to generate a comparative feature matrix.',
        inputSchema: CompareCompetitorsInputSchema,
    }),
    Widget(comparisonWidget('competitor-comparison')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CompareCompetitorsTools.prototype, "compareCompetitors", null);
CompareCompetitorsTools = __decorate([
    Injectable({ deps: [CompetitorComparisonService] }),
    __metadata("design:paramtypes", [CompetitorComparisonService])
], CompareCompetitorsTools);
export { CompareCompetitorsTools };
//# sourceMappingURL=compare_competitors.tools.js.map