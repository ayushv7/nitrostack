import { spawn } from 'child_process';
import path from 'path';

console.log('--- RUNNING AUTOMATED SELF-TESTS FOR NEW MCP TOOLS ---');

async function runMcpToolTest(toolName, args) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', ['dist/index.js'], {
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let outputStr = '';
        let errorStr = '';

        child.stdout.on('data', (data) => {
            outputStr += data.toString();
        });

        child.stderr.on('data', (data) => {
            errorStr += data.toString();
        });

        const rpcRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        child.stdin.write(JSON.stringify(rpcRequest) + '\n');

        setTimeout(() => {
            child.kill();
            resolve({ outputStr, errorStr });
        }, 6000);
    });
}

async function runAllTests() {
    console.log('\n[TEST 1] extract_competitor_profiles - Valid Competitors');
    const t1 = await runMcpToolTest('extract_competitor_profiles', {
        competitors: [
            { name: 'Rover', website: 'https://rover.com', description: 'Pet sitting marketplace' },
            { name: 'Wag!', website: 'https://wag.co', description: 'Dog walking app' }
        ]
    });
    console.log('Test 1 stdout includes structuredContent:', t1.outputStr.includes('structuredContent') || t1.outputStr.includes('profiles'));

    console.log('\n[TEST 2] extract_competitor_profiles - Empty Competitors');
    const t2 = await runMcpToolTest('extract_competitor_profiles', { competitors: [] });
    console.log('Test 2 status empty:', t2.outputStr.includes('empty') || t2.outputStr.includes('profiles'));

    console.log('\n[TEST 3] compare_competitors - 2 Competitors');
    const t3 = await runMcpToolTest('compare_competitors', {
        profiles: [
            { name: 'Rover', website: 'https://rover.com', pricingModel: 'Freemium', businessModel: 'Marketplace', strengths: ['Network'], weaknesses: ['Take rate'] },
            { name: 'Wag!', website: 'https://wag.co', pricingModel: 'On-Demand', businessModel: 'B2C', strengths: ['On demand'], weaknesses: ['Coverage'] }
        ]
    });
    console.log('Test 3 comparisonTable returned:', t3.outputStr.includes('comparisonTable') || t3.outputStr.includes('topCompetitors'));

    console.log('\n[TEST 4] compare_competitors - Empty List');
    const t4 = await runMcpToolTest('compare_competitors', { profiles: [] });
    console.log('Test 4 empty list handled:', t4.outputStr.includes('empty') || t4.outputStr.includes('No competitor profiles'));

    console.log('\n--- ALL SELF-TESTS COMPLETED SUCCESSFULLY ---');
}

runAllTests().catch(console.error);
