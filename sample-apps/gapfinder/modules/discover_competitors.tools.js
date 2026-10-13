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
import { CompetitorDiscoveryService } from '../services/competitorDiscovery.service.js';
import { DiscoverCompetitorsInputSchema } from '../types/competitor.js';
function competitorListWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let DiscoverCompetitorsTools = class DiscoverCompetitorsTools {
    discoveryService;
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    async discoverCompetitors(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: discover_competitors] Execution Started', { input: JSON.stringify(args) });
        try {
            const parseResult = DiscoverCompetitorsInputSchema.safeParse(args);
            const parsedInput = parseResult.success ? parseResult.data : (args || {});
            const result = await this.discoveryService.discover(parsedInput);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: discover_competitors] Execution Completed', {
                competitorsCount: result.competitors?.length || 0,
                durationMs: duration
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: discover_competitors] Execution Failed', { error: errorMessage, durationMs: duration });
            return {
                competitors: [],
                status: 'error',
                message: errorMessage,
                error: errorMessage
            };
        }
    }
};
__decorate([
    Tool({
        name: 'discover_competitors',
        description: 'Discover relevant competitors for a startup or product idea based on its structured properties and keywords using search engine APIs.',
        inputSchema: DiscoverCompetitorsInputSchema,
    }),
    Widget(competitorListWidget('competitor-list')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DiscoverCompetitorsTools.prototype, "discoverCompetitors", null);
DiscoverCompetitorsTools = __decorate([
    Injectable({ deps: [CompetitorDiscoveryService] }),
    __metadata("design:paramtypes", [CompetitorDiscoveryService])
], DiscoverCompetitorsTools);
export { DiscoverCompetitorsTools };
//# sourceMappingURL=discover_competitors.tools.js.map