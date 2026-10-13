import { GeminiService } from './gemini.service.js';
import { UnderstandIdeaInput, UnderstandIdeaOutput } from '../types/idea.types.js';
export declare class IdeaService {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    understand(input: UnderstandIdeaInput): Promise<UnderstandIdeaOutput>;
}
//# sourceMappingURL=idea.service.d.ts.map