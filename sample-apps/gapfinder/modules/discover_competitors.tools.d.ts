import { ExecutionContext } from '@nitrostack/core';
import { CompetitorDiscoveryService } from '../services/competitorDiscovery.service.js';
export declare class DiscoverCompetitorsTools {
    private readonly discoveryService;
    constructor(discoveryService: CompetitorDiscoveryService);
    discoverCompetitors(args: any, ctx: ExecutionContext): Promise<{
        competitors: {
            name: string;
            website: string;
            description: string;
            reason: string;
        }[];
        message?: string | undefined;
        status?: string | undefined;
        error?: string | undefined;
    }>;
}
//# sourceMappingURL=discover_competitors.tools.d.ts.map