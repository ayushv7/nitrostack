import 'dotenv/config';
import { GeminiService } from '../dist/services/gemini.service.js';
import { TavilyClient } from '../dist/api/tavily.js';
import { CompetitorDiscoveryService } from '../dist/services/competitorDiscovery.service.js';

async function runTest() {
    console.log('--- STARTING INTEGRATION TEST ---');
    console.log('Environment GEMINI_API_KEY check:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');
    console.log('Environment TAVILY_API_KEY check:', process.env.TAVILY_API_KEY ? 'Present' : 'Missing');

    try {
        const geminiService = new GeminiService();
        const tavilyClient = new TavilyClient();
        const discoveryService = new CompetitorDiscoveryService(geminiService, tavilyClient);

        const testInput = {
            category: 'EdTech',
            coreProblem: 'Students struggle to prepare for interviews.',
            targetAudience: 'College students',
            valueProposition: 'AI-powered interview preparation',
            keywords: ['AI interview', 'mock interview', 'technical interview'],
            geography: 'India'
        };

        console.log('Calling CompetitorDiscoveryService.discover with input:', JSON.stringify(testInput, null, 2));
        const result = await discoveryService.discover(testInput);
        console.log('Success! Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('ERROR OCCURRED DURING TEST EXECUTION:');
        console.error(error);
    }
    console.log('--- TEST FINISHED ---');
}

runTest();
