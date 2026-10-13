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
import { UnderstandIdeaOutputSchema } from '../types/idea.types.js';
let IdeaService = class IdeaService {
    geminiService;
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    async understand(input) {
        const constraints = [];
        if (input.industry)
            constraints.push(`Industry: ${input.industry}`);
        if (input.geography)
            constraints.push(`Geography Focus: ${input.geography}`);
        if (input.targetAudience)
            constraints.push(`Target Audience Segment: ${input.targetAudience}`);
        const constraintsText = constraints.length > 0
            ? `\nFocus Constraints:\n${constraints.join('\n')}`
            : '';
        const prompt = `You are an expert startup advisor and product strategist. Analyze the following product/startup idea and break it down into a structured form.
        
Product/Startup Idea:
"${input.idea}"
${constraintsText}

Tasks:
1. Identify the high-level industry sector or category this idea fits into.
2. Clearly formulate the core problem this idea is trying to solve.
3. Identify the primary target customer segment or user group.
4. Extract the unique value proposition (Value Prop) - why users would use this over alternatives.
5. Provide a list of 5-8 search keywords or search phrases (short 1-3 word terms) that can be used to search for competitors, existing projects, or products in this space. Avoid generic terms like "app", "software", or "website" unless combined with specific domain words.

Return the response strictly adhering to the requested JSON schema.`;
        try {
            return await this.geminiService.generateStructuredOutput(prompt, UnderstandIdeaOutputSchema);
        }
        catch (error) {
            console.warn('[IdeaService] Gemini API limit or quota error. Returning structured idea analysis fallback.', error.message);
            return {
                category: input.industry || 'Technology & Software',
                coreProblem: input.idea || 'Users struggle with manual tasks in this domain.',
                targetAudience: input.targetAudience || 'Target Users and Professionals',
                valueProposition: `A dedicated solution for ${input.idea || 'this domain'}.`,
                keywords: ['startups', 'software', 'platform', 'app']
            };
        }
    }
};
IdeaService = __decorate([
    Injectable({ deps: [GeminiService] }),
    __metadata("design:paramtypes", [GeminiService])
], IdeaService);
export { IdeaService };
//# sourceMappingURL=idea.service.js.map