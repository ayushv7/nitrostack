import { ExecutionContext } from '@nitrostack/core';
import { CompetitorProfileService } from '../services/competitorProfile.service.js';
export declare class ExtractCompetitorProfilesTools {
    private readonly profileService;
    constructor(profileService: CompetitorProfileService);
    extractProfiles(args: any, ctx: ExecutionContext): Promise<{
        profiles: {
            name: string;
            website: string;
            overview: string;
            problemSolved: string;
            targetCustomers: string;
            pricingModel: string;
            keyFeatures: string[];
            techStack: string[];
            businessModel: string;
            funding: string;
            strengths: string[];
            weaknesses: string[];
            usp: string;
        }[];
        message?: string | undefined;
        status?: string | undefined;
    }>;
}
//# sourceMappingURL=extract_competitor_profiles.tools.d.ts.map