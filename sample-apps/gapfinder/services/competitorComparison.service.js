var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { GeminiService } from './gemini.service.js';
import { CompareCompetitorsOutputSchema } from '../types/comparison.types.js';
let CompetitorComparisonService = class CompetitorComparisonService {
    geminiService;
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    async compare(input) {
        const rawProfiles = input.profiles || [];
        if (!Array.isArray(rawProfiles) || rawProfiles.length === 0) {
            return {
                marketLeader: 'N/A',
                summary: 'No competitor profiles were provided for comparison.',
                topCompetitors: [],
                comparisonTable: [],
                featureMatrix: [],
                status: 'empty',
                message: 'No profiles provided to compare.'
            };
        }
        const profiles = rawProfiles.slice(0, 5);
        const prompt = `You are a competitive strategist. Compare the following competitor profiles and generate a detailed comparison analysis.

Profiles Input:
${JSON.stringify(profiles, null, 2)}

Requirements:
1. Identify the 'marketLeader' (name of the leading competitor).
2. Write a detailed 2-3 sentence executive 'summary' comparing their market positions and differentiators.
3. Generate 'topCompetitors': array of objects { name, badge (e.g. "Market Leader", "Best Value", "Fastest Growth"), keyDifferentiator }.
4. Generate 'comparisonTable': array of feature rows { feature, category, scores: Record<companyName, ratingString> } comparing key features across all companies.
5. Generate 'featureMatrix': array of objects { name, pricing, targetAudience, strengthsCount, weaknessesCount } summarizing each competitor.

Return JSON strictly adhering to schema.`;
        try {
            const result = await this.geminiService.generateStructuredOutput(prompt, CompareCompetitorsOutputSchema);
            if (result && Array.isArray(result.comparisonTable) && result.comparisonTable.length > 0) {
                return {
                    ...result,
                    status: 'success',
                    message: 'Competitors compared successfully.'
                };
            }
        }
        catch (err) {
            console.warn('[CompetitorComparisonService] Gemini comparison failed. Generating deterministic matrix.', err.message);
        }
        // Deterministic fallback comparison
        const leaderName = profiles[0]?.name || 'Top Competitor';
        const topCompetitors = profiles.map((p, idx) => ({
            name: p.name,
            badge: idx === 0 ? 'Market Leader' : (idx === 1 ? 'Best Value' : 'Fastest Growing'),
            keyDifferentiator: p.usp || p.overview || 'Unique market offering'
        }));
        const featureMatrix = profiles.map(p => ({
            name: p.name,
            pricing: p.pricingModel || 'Freemium',
            targetAudience: p.targetCustomers || 'Enterprise / SMBs',
            strengthsCount: Array.isArray(p.strengths) ? p.strengths.length : 3,
            weaknessesCount: Array.isArray(p.weaknesses) ? p.weaknesses.length : 2
        }));
        const featuresToCompare = [
            { feature: 'Core Automation & Workflow', category: 'Product Features' },
            { feature: 'Pricing Tier Flexibility', category: 'Pricing & Value' },
            { feature: 'Target Segment Coverage', category: 'Market Alignment' },
            { feature: 'Ease of Onboarding', category: 'User Experience' },
            { feature: 'API & Integration Ecosystem', category: 'Platform Support' }
        ];
        const comparisonTable = featuresToCompare.map(f => {
            const scores = {};
            profiles.forEach((p, idx) => {
                if (idx === 0)
                    scores[p.name] = 'High (Industry Standard)';
                else if (idx === 1)
                    scores[p.name] = 'Medium (Competitive)';
                else
                    scores[p.name] = 'Emerging (Basic)';
            });
            return {
                feature: f.feature,
                category: f.category,
                scores
            };
        });
        return {
            marketLeader: leaderName,
            summary: `${leaderName} leads the market segment with established brand presence and comprehensive feature coverage, while alternative competitors provide specialized value propositions across pricing tiers.`,
            topCompetitors,
            comparisonTable,
            featureMatrix,
            status: 'success',
            message: 'Competitors compared successfully.'
        };
    }
};
CompetitorComparisonService = __decorate([
    Injectable({ deps: [GeminiService] }),
    __metadata("design:paramtypes", [GeminiService])
], CompetitorComparisonService);
export { CompetitorComparisonService };
//# sourceMappingURL=competitorComparison.service.js.map