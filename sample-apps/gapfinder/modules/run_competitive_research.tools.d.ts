import { ExecutionContext } from '@nitrostack/core';
import { PipelineOrchestratorService } from '../services/pipelineOrchestrator.service.js';
export declare class RunCompetitiveResearchTools {
    private readonly orchestratorService;
    constructor(orchestratorService: PipelineOrchestratorService);
    runCompetitiveResearch(args: any, ctx: ExecutionContext): Promise<{
        message: string;
        status: string;
        competitors: {
            name: string;
            website: string;
            description: string;
            reason: string;
        }[];
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
        currentStep: number;
        steps: {
            status: "pending" | "running" | "completed" | "failed";
            stepNumber: number;
            stepName: string;
            error?: string | undefined;
        }[];
        error?: string | undefined;
        success?: boolean | undefined;
        ideaAnalysis?: {
            targetAudience: string;
            category: string;
            coreProblem: string;
            valueProposition: string;
            keywords: string[];
        } | undefined;
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
        report?: {
            title: string;
            executiveSummary: string;
            sections: {
                type: string;
                content: string;
                heading: string;
            }[];
            keyTakeaways: string[];
        } | undefined;
        failedStep?: string | undefined;
        failedStage?: string | undefined;
        stack?: string | undefined;
    } | {
        success: boolean;
        status: string;
        failedStage: string;
        message: string;
        error: string;
        steps: {
            status: "pending" | "running" | "completed" | "failed";
            stepNumber: number;
            stepName: string;
            error?: string | undefined;
        }[];
        stack?: undefined;
    } | {
        success: boolean;
        status: string;
        failedStage: any;
        message: string;
        stack: any;
        error: string;
        steps?: undefined;
    }>;
}
//# sourceMappingURL=run_competitive_research.tools.d.ts.map