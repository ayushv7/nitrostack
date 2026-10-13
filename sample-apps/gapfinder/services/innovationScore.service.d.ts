import { GeminiService } from './gemini.service.js';
import { InnovationScoringOutput, MarketGapAnalysisOutput } from '../types/pipeline.types.js';
import { UnderstandIdeaOutput } from '../types/idea.types.js';
import { CompetitorProfile } from '../types/profile.types.js';
export declare class InnovationScoreService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    scoreInnovation(ideaAnalysis: UnderstandIdeaOutput, profiles: CompetitorProfile[], marketGaps: MarketGapAnalysisOutput): Promise<InnovationScoringOutput>;
}
//# sourceMappingURL=innovationScore.service.d.ts.map