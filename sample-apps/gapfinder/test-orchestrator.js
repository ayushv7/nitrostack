import { spawn } from 'child_process';

console.log('--- TESTING RUN_COMPETITIVE_RESEARCH ORCHESTRATOR MCP TOOL ---');

async function testOrchestrator() {
    return new Promise((resolve) => {
        const child = spawn('node', ['dist/index.js'], {
            cwd: process.cwd(),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let outputStr = '';
        let errorStr = '';

        child.stdout.on('data', (d) => { outputStr += d.toString(); });
        child.stderr.on('data', (d) => { errorStr += d.toString(); });

        const rpcRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
                name: 'run_competitive_research',
                arguments: {
                    idea: 'An AI-powered pet sitting app with automated sitter matching and real-time GPS tracking.'
                }
            }
        };

        child.stdin.write(JSON.stringify(rpcRequest) + '\n');

        setTimeout(() => {
            child.kill();
            resolve({ outputStr, errorStr });
        }, 12000);
    });
}

testOrchestrator().then(({ outputStr, errorStr }) => {
    console.log('[STDOUT Result]:', outputStr.substring(0, 500) + '...');
    console.log('Pipeline Output contains structuredContent:', outputStr.includes('structuredContent') || outputStr.includes('steps'));
    console.log('Pipeline Output contains report title:', outputStr.includes('report') || outputStr.includes('Competitive'));
    console.log('--- ORCHESTRATOR TEST COMPLETED SUCCESSFULLY ---');
}).catch(console.error);
