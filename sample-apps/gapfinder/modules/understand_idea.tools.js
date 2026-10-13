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
import { IdeaService } from '../services/idea.service.js';
import { UnderstandIdeaInputSchema } from '../types/idea.types.js';
function ideaSummaryWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let UnderstandIdeaTools = class UnderstandIdeaTools {
    ideaService;
    constructor(ideaService) {
        this.ideaService = ideaService;
    }
    async understandIdea(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: understand_idea] Execution Started', { input: JSON.stringify(args) });
        try {
            const parseResult = UnderstandIdeaInputSchema.safeParse(args);
            const input = parseResult.success ? parseResult.data : { idea: typeof args === 'string' ? args : (args?.idea || 'New Idea') };
            const result = await this.ideaService.understand(input);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: understand_idea] Execution Completed', {
                category: result.category,
                durationMs: duration
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMsg = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: understand_idea] Execution Failed', { error: errorMsg, durationMs: duration });
            return {
                category: args?.industry || 'Technology SaaS',
                coreProblem: args?.idea || 'Core problem analysis',
                targetAudience: args?.targetAudience || 'Target Users',
                valueProposition: `Solution for ${args?.idea || 'this domain'}.`,
                keywords: ['AI platform', 'SaaS platform', 'automation tool'],
                status: 'error',
                error: errorMsg
            };
        }
    }
};
__decorate([
    Tool({
        name: 'understand_idea',
        description: 'Analyze a raw product or startup idea to identify industry category, core problem, target segment, value proposition, and competitor search keywords.',
        inputSchema: UnderstandIdeaInputSchema,
    }),
    Widget(ideaSummaryWidget('idea-summary')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UnderstandIdeaTools.prototype, "understandIdea", null);
UnderstandIdeaTools = __decorate([
    Injectable({ deps: [IdeaService] }),
    __metadata("design:paramtypes", [IdeaService])
], UnderstandIdeaTools);
export { UnderstandIdeaTools };
//# sourceMappingURL=understand_idea.tools.js.map