import { z } from 'zod';
export declare class GeminiService {
    private ai;
    private defaultModel;
    private apiKey;
    constructor();
    /**
     * Generates structured output using a Zod schema with built-in retry backoff.
     */
    generateStructuredOutput<T>(prompt: string, schema: z.ZodSchema<T>, options?: {
        model?: string;
    }): Promise<T>;
    private getSimulatedResponse;
}
//# sourceMappingURL=gemini.service.d.ts.map