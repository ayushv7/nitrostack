import { ExecutionContext } from '@nitrostack/core';
import { ReportGeneratorService } from '../services/reportGenerator.service.js';
import { z } from 'zod';
export declare const GenerateReportInputSchema: z.ZodObject<{
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
    competitors: z.ZodCatch<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        website: z.ZodDefault<z.ZodString>;
        description: z.ZodDefault<z.ZodString>;
        reason: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        website: string;
        description: string;
        reason: string;
    }, {
        name?: string | undefined;
        website?: string | undefined;
        description?: string | undefined;
        reason?: string | undefined;
    }>, "many">>>;
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
    comparison: z.ZodOptional<z.ZodObject<{
        marketLeader: z.ZodDefault<z.ZodString>;
        summary: z.ZodDefault<z.ZodString>;
        topCompetitors: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            badge: z.ZodString;
            keyDifferentiator: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            badge: string;
            keyDifferentiator: string;
        }, {
            name: string;
            badge: string;
            keyDifferentiator: string;
        }>, "many">>;
        comparisonTable: z.ZodDefault<z.ZodArray<z.ZodObject<{
            feature: z.ZodString;
            category: z.ZodString;
            scores: z.ZodRecord<z.ZodString, z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            category: string;
            feature: string;
            scores: Record<string, string>;
        }, {
            category: string;
            feature: string;
            scores: Record<string, string>;
        }>, "many">>;
        featureMatrix: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            pricing: z.ZodString;
            targetAudience: z.ZodString;
            strengthsCount: z.ZodDefault<z.ZodNumber>;
            weaknessesCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            targetAudience: string;
            name: string;
            pricing: string;
            strengthsCount: number;
            weaknessesCount: number;
        }, {
            targetAudience: string;
            name: string;
            pricing: string;
            strengthsCount?: number | undefined;
            weaknessesCount?: number | undefined;
        }>, "many">>;
        status: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        message?: string | undefined;
        status?: string | undefined;
        marketLeader?: string | undefined;
        summary?: string | undefined;
        topCompetitors?: {
            name: string;
            badge: string;
            keyDifferentiator: string;
        }[] | undefined;
        comparisonTable?: {
            category: string;
            feature: string;
            scores: Record<string, string>;
        }[] | undefined;
        featureMatrix?: {
            targetAudience: string;
            name: string;
            pricing: string;
            strengthsCount?: number | undefined;
            weaknessesCount?: number | undefined;
        }[] | undefined;
    }>>;
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
    innovationScores: z.ZodOptional<z.ZodObject<{
        overallScore: z.ZodDefault<z.ZodNumber>;
        explanation: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        dimensionScores: z.ZodDefault<z.ZodObject<{
            problemUniqueness: z.ZodDefault<z.ZodNumber>;
            marketTiming: z.ZodDefault<z.ZodNumber>;
            moatPotential: z.ZodDefault<z.ZodNumber>;
            executionFeasibility: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            problemUniqueness: number;
            marketTiming: number;
            moatPotential: number;
            executionFeasibility: number;
        }, {
            problemUniqueness?: number | undefined;
            marketTiming?: number | undefined;
            moatPotential?: number | undefined;
            executionFeasibility?: number | undefined;
        }>>;
        recommendations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        riskFactors: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
        overallScore?: number | undefined;
        explanation?: string | undefined;
        dimensionScores?: {
            problemUniqueness?: number | undefined;
            marketTiming?: number | undefined;
            moatPotential?: number | undefined;
            executionFeasibility?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        riskFactors?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    competitors?: {
        name: string;
        website: string;
        description: string;
        reason: string;
    }[] | undefined;
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
    comparison?: {
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
    } | undefined;
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
    innovationScores?: {
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
    } | undefined;
}, {
    competitors?: unknown;
    ideaAnalysis?: {
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    } | undefined;
    profiles?: unknown;
    comparison?: {
        message?: string | undefined;
        status?: string | undefined;
        marketLeader?: string | undefined;
        summary?: string | undefined;
        topCompetitors?: {
            name: string;
            badge: string;
            keyDifferentiator: string;
        }[] | undefined;
        comparisonTable?: {
            category: string;
            feature: string;
            scores: Record<string, string>;
        }[] | undefined;
        featureMatrix?: {
            targetAudience: string;
            name: string;
            pricing: string;
            strengthsCount?: number | undefined;
            weaknessesCount?: number | undefined;
        }[] | undefined;
    } | undefined;
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
    innovationScores?: {
        overallScore?: number | undefined;
        explanation?: string | undefined;
        dimensionScores?: {
            problemUniqueness?: number | undefined;
            marketTiming?: number | undefined;
            moatPotential?: number | undefined;
            executionFeasibility?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        riskFactors?: string[] | undefined;
    } | undefined;
}>;
export declare class GenerateReportTools {
    private readonly reportService;
    constructor(reportService: ReportGeneratorService);
    generateReport(args: any, ctx: ExecutionContext): Promise<{
        title: string;
        executiveSummary: string;
        sections: {
            type: string;
            content: string;
            heading: string;
        }[];
        keyTakeaways: string[];
    } | {
        title: string;
        executiveSummary: string;
        sections: never[];
        keyTakeaways: never[];
        status: string;
        error: string;
    }>;
}
//# sourceMappingURL=generate_report.tools.d.ts.map