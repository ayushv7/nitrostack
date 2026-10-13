import { z } from 'zod';
export declare const TavilySearchResultSchema: z.ZodObject<{
    title: z.ZodString;
    url: z.ZodString;
    content: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    title: string;
    url: string;
    content: string;
    score?: number | undefined;
}, {
    title: string;
    url: string;
    content: string;
    score?: number | undefined;
}>;
export declare const TavilySearchResponseSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        content: z.ZodString;
        score: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        content: string;
        score?: number | undefined;
    }, {
        title: string;
        url: string;
        content: string;
        score?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    results: {
        title: string;
        url: string;
        content: string;
        score?: number | undefined;
    }[];
}, {
    results: {
        title: string;
        url: string;
        content: string;
        score?: number | undefined;
    }[];
}>;
export type TavilySearchResult = z.infer<typeof TavilySearchResultSchema>;
export type TavilySearchResponse = z.infer<typeof TavilySearchResponseSchema>;
export declare class TavilyClient {
    private apiKey;
    private baseUrl;
    constructor();
    /**
     * Search Tavily using the POST API with retry and timeout logic.
     */
    search(query: string, maxResults?: number): Promise<TavilySearchResponse>;
    /**
     * Simulated mock responses for testing without an API key.
     */
    private getMockResults;
}
//# sourceMappingURL=tavily.d.ts.map