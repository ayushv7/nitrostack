import { spawn } from 'child_process';

console.log('=== RUNNING RAW ORCHESTRATOR TEST ===');

async function runTest() {
    return new Promise((resolve) => {
        const child = spawn('node', ['dist/index.js'], {
            cwd: process.cwd(),
            env: process.env,
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
                arguments: {}
            }
        };

        child.stdin.write(JSON.stringify(rpcRequest) + '\n');

        setTimeout(() => {
            child.kill();
            resolve({ outputStr, errorStr });
        }, 15000);
    });
}

runTest().then((res) => {
    console.log('--- STDOUT ---');
    console.log(res.outputStr);
    console.log('--- STDERR ---');
    console.log(res.errorStr);
}).catch(console.error);
