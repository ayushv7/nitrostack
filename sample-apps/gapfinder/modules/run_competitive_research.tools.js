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
import { PipelineOrchestratorService } from '../services/pipelineOrchestrator.service.js';
import { RunCompetitiveResearchInputSchema } from '../types/pipeline.types.js';
function pipelineWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let RunCompetitiveResearchTools = class RunCompetitiveResearchTools {
    orchestratorService;
    constructor(orchestratorService) {
        this.orchestratorService = orchestratorService;
    }
    async runCompetitiveResearch(args, ctx) {
        const startTime = Date.now();
        console.error('[START run_competitive_research] Input:', JSON.stringify(args));
        ctx.logger.info('[Tool: run_competitive_research] Pipeline Orchestrator Started', { input: JSON.stringify(args) });
        try {
            const parseResult = RunCompetitiveResearchInputSchema.safeParse(args || {});
            if (!parseResult.success) {
                throw new Error(`Invalid input: ${parseResult.error.message}`);
            }
            const input = {
                idea: parseResult.data.idea,
                industry: parseResult.data.industry || args?.industry || '',
                geography: parseResult.data.geography || args?.geography || '',
                targetAudience: parseResult.data.targetAudience || args?.targetAudience || ''
            };
            const result = await this.orchestratorService.runPipeline(input);
            const duration = Date.now() - startTime;
            console.error('[END run_competitive_research] Status:', result.status, `Time: ${duration}ms`);
            ctx.logger.info('[Tool: run_competitive_research] Pipeline Orchestrator Completed', {
                status: result.status,
                currentStep: result.currentStep,
                durationMs: duration
            });
            if (result.status === 'failed') {
                return {
                    success: false,
                    status: 'failed',
                    failedStage: result.failedStep || 'run_competitive_research',
                    message: result.message || 'Pipeline execution failed.',
                    error: result.error || 'Pipeline execution failed.',
                    steps: result.steps
                };
            }
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('[END run_competitive_research] [CRITICAL EXCEPTION]:', errorMessage, error.stack);
            ctx.logger.error('[Tool: run_competitive_research] Pipeline Orchestrator Failed', { error: errorMessage, durationMs: duration });
            return {
                success: false,
                status: 'failed',
                failedStage: error.failedStep || 'run_competitive_research',
                message: errorMessage,
                stack: error.stack,
                error: errorMessage
            };
        }
    }
};
__decorate([
    Tool({
        name: 'run_competitive_research',
        description: 'Execute the full 7-step AI Competitive Research pipeline for a product/startup idea automatically.',
        inputSchema: RunCompetitiveResearchInputSchema,
    }),
    Widget(pipelineWidget('pipeline-progress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RunCompetitiveResearchTools.prototype, "runCompetitiveResearch", null);
RunCompetitiveResearchTools = __decorate([
    Injectable({ deps: [PipelineOrchestratorService] }),
    __metadata("design:paramtypes", [PipelineOrchestratorService])
], RunCompetitiveResearchTools);
export { RunCompetitiveResearchTools };
//# sourceMappingURL=run_competitive_research.tools.js.map