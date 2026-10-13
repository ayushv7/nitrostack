import { GeminiService } from './gemini.service.js';
import { CompareCompetitorsInput, CompareCompetitorsOutput } from '../types/comparison.types.js';
export declare class CompetitorComparisonService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    compare(input: CompareCompetitorsInput): Promise<CompareCompetitorsOutput>;
}
//# sourceMappingURL=competitorComparison.service.d.ts.map