import { ExecutionContext } from '@nitrostack/core';
import { IdeaService } from '../services/idea.service.js';
export declare class UnderstandIdeaTools {
    private readonly ideaService;
    constructor(ideaService: IdeaService);
    understandIdea(args: any, ctx: ExecutionContext): Promise<{
        targetAudience: string;
        category: string;
        coreProblem: string;
        valueProposition: string;
        keywords: string[];
    } | {
        category: any;
        coreProblem: any;
        targetAudience: any;
        valueProposition: string;
        keywords: string[];
        status: string;
        error: string;
    }>;
}
//# sourceMappingURL=understand_idea.tools.d.ts.map