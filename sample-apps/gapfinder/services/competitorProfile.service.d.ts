import { GeminiService } from './gemini.service.js';
import { TavilyClient } from '../api/tavily.js';
import { ExtractCompetitorProfilesInput, ExtractCompetitorProfilesOutput } from '../types/profile.types.js';
export declare class CompetitorProfileService {
    private readonly geminiService;
    private readonly tavilyClient;
    constructor(geminiService: GeminiService, tavilyClient: TavilyClient);
    extractProfiles(input: ExtractCompetitorProfilesInput): Promise<ExtractCompetitorProfilesOutput>;
}
//# sourceMappingURL=competitorProfile.service.d.ts.map