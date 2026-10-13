import { GeminiService } from './gemini.service.js';
import { TavilyClient } from '../api/tavily.js';
import { DiscoverCompetitorsInput, DiscoverCompetitorsOutput } from '../types/competitor.js';
export declare class CompetitorDiscoveryService {
    private readonly geminiService;
    private readonly tavilyClient;
    constructor(geminiService: GeminiService, tavilyClient: TavilyClient);
    private validateInput;
    discover(input: DiscoverCompetitorsInput): Promise<DiscoverCompetitorsOutput>;
}
//# sourceMappingURL=competitorDiscovery.service.d.ts.map