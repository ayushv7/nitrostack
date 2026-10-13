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
import { CompetitorProfileService } from '../services/competitorProfile.service.js';
import { ExtractCompetitorProfilesInputSchema } from '../types/profile.types.js';
function profileWidget(route) {
    return {
        route,
        prefersBorder: true,
    };
}
let ExtractCompetitorProfilesTools = class ExtractCompetitorProfilesTools {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    async extractProfiles(args, ctx) {
        const startTime = Date.now();
        ctx.logger.info('[Tool: extract_competitor_profiles] Execution Started', { input: JSON.stringify(args) });
        try {
            const parseResult = ExtractCompetitorProfilesInputSchema.safeParse(args);
            const parsedInput = parseResult.success ? parseResult.data : (args || {});
            const result = await this.profileService.extractProfiles(parsedInput);
            const duration = Date.now() - startTime;
            ctx.logger.info('[Tool: extract_competitor_profiles] Execution Completed', {
                profilesCount: result.profiles?.length || 0,
                durationMs: duration
            });
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('[Tool: extract_competitor_profiles] Execution Failed', { error: errorMessage, durationMs: duration });
            return {
                profiles: [],
                status: 'error',
                message: errorMessage
            };
        }
    }
};
__decorate([
    Tool({
        name: 'extract_competitor_profiles',
        description: 'Extract comprehensive competitor profiles including pricing, features, business model, funding, strengths, weaknesses, and USP.',
        inputSchema: ExtractCompetitorProfilesInputSchema,
    }),
    Widget(profileWidget('competitor-profile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExtractCompetitorProfilesTools.prototype, "extractProfiles", null);
ExtractCompetitorProfilesTools = __decorate([
    Injectable({ deps: [CompetitorProfileService] }),
    __metadata("design:paramtypes", [CompetitorProfileService])
], ExtractCompetitorProfilesTools);
export { ExtractCompetitorProfilesTools };
//# sourceMappingURL=extract_competitor_profiles.tools.js.map