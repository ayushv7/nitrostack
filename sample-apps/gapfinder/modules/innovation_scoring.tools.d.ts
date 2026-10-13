import { ExecutionContext } from '@nitrostack/core';
import { InnovationScoreService } from '../services/innovationScore.service.js';
import { z } from 'zod';
export declare const InnovationScoringInputSchema: z.ZodObject<{
    ideaAnalysis: z.ZodOptional<z.ZodObject<{
        category: z.ZodString;
        coreProblem: z.ZodString;
        targetAudience: z.ZodString;
        valueProposition: z.ZodString;
        keywords: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    }, {
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    }>>;
    profiles: z.ZodCatch<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        website: z.ZodDefault<z.ZodString>;
        overview: z.ZodDefault<z.ZodString>;
        problemSolved: z.ZodDefault<z.ZodString>;
        targetCustomers: z.ZodDefault<z.ZodString>;
        pricingModel: z.ZodDefault<z.ZodString>;
        keyFeatures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        techStack: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        businessModel: z.ZodDefault<z.ZodString>;
        funding: z.ZodDefault<z.ZodString>;
        strengths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        weaknesses: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        usp: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        name?: string | undefined;
        website?: string | undefined;
        overview?: string | undefined;
        problemSolved?: string | undefined;
        targetCustomers?: string | undefined;
        pricingModel?: string | undefined;
        keyFeatures?: string[] | undefined;
        techStack?: string[] | undefined;
        businessModel?: string | undefined;
        funding?: string | undefined;
        strengths?: string[] | undefined;
        weaknesses?: string[] | undefined;
        usp?: string | undefined;
    }>, "many">>>;
    marketGaps: z.ZodOptional<z.ZodObject<{
        gaps: z.ZodDefault<z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            opportunitySize: z.ZodDefault<z.ZodString>;
            difficulty: z.ZodDefault<z.ZodString>;
            targetSegment: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            description: string;
            opportunitySize: string;
            difficulty: string;
            targetSegment: string;
        }, {
            title: string;
            description: string;
            opportunitySize?: string | undefined;
            difficulty?: string | undefined;
            targetSegment?: string | undefined;
        }>, "many">>;
        unaddressedProblems: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        whitespaceOpportunities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        gaps: {
            title: string;
            description: string;
            opportunitySize: string;
            difficulty: string;
            targetSegment: string;
        }[];
        unaddressedProblems: string[];
        whitespaceOpportunities: string[];
    }, {
        gaps?: {
            title: string;
            description: string;
            opportunitySize?: string | undefined;
            difficulty?: string | undefined;
            targetSegment?: string | undefined;
        }[] | undefined;
        unaddressedProblems?: string[] | undefined;
        whitespaceOpportunities?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    ideaAnalysis?: {
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    } | undefined;
    profiles?: {
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
    }[] | undefined;
    marketGaps?: {
        gaps: {
            title: string;
            description: string;
            opportunitySize: string;
            difficulty: string;
            targetSegment: string;
        }[];
        unaddressedProblems: string[];
        whitespaceOpportunities: string[];
    } | undefined;
}, {
    ideaAnalysis?: {
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    } | undefined;
    profiles?: unknown;
    marketGaps?: {
        gaps?: {
            title: string;
            description: string;
            opportunitySize?: string | undefined;
            difficulty?: string | undefined;
            targetSegment?: string | undefined;
        }[] | undefined;
        unaddressedProblems?: string[] | undefined;
        whitespaceOpportunities?: string[] | undefined;
    } | undefined;
}>;
export declare class InnovationScoringTools {
    private readonly scoreService;
    constructor(scoreService: InnovationScoreService);
    scoreInnovation(args: any, ctx: ExecutionContext): Promise<{
        overallScore: number;
        explanation: string;
        dimensionScores: {
            problemUniqueness: number;
            marketTiming: number;
            moatPotential: number;
            executionFeasibility: number;
        };
        recommendations: string[];
        riskFactors: string[];
    } | {
        overallScore: number;
        dimensionScores: {
            problemUniqueness: number;
            marketTiming: number;
            moatPotential: number;
            executionFeasibility: number;
        };
        recommendations: never[];
        riskFactors: never[];
        status: string;
        error: string;
    }>;
}
//# sourceMappingURL=innovation_scoring.tools.d.ts.map