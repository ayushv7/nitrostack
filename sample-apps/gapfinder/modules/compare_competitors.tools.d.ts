import { ExecutionContext } from '@nitrostack/core';
import { CompetitorComparisonService } from '../services/competitorComparison.service.js';
export declare class CompareCompetitorsTools {
    private readonly comparisonService;
    constructor(comparisonService: CompetitorComparisonService);
    compareCompetitors(args: any, ctx: ExecutionContext): Promise<{
        marketLeader: string;
        summary: string;
        topCompetitors: {
            name: string;
            badge: string;
            keyDifferentiator: string;
        }[];
        comparisonTable: {
            category: string;
            feature: string;
            scores: Record<string, string>;
        }[];
        featureMatrix: {
            targetAudience: string;
            name: string;
            pricing: string;
            strengthsCount: number;
            weaknessesCount: number;
        }[];
        message?: string | undefined;
        status?: string | undefined;
    }>;
}
//# sourceMappingURL=compare_competitors.tools.d.ts.map