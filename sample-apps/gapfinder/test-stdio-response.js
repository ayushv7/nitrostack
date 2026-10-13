import { spawn } from 'child_process';

console.log('=== STDIO RAW RESPONSE CAPTURE ===');

async function runTest() {
    return new Promise((resolve) => {
        const child = spawn('node', ['dist/index.js'], {
            cwd: process.cwd(),
            env: { ...process.env, NODE_ENV: 'development' },
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (d) => { stdout += d.toString(); });
        child.stderr.on('data', (d) => { stderr += d.toString(); });

        // Wait for server to boot
        setTimeout(() => {
            const rpcRequest = {
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/call',
                params: {
                    name: 'run_competitive_research',
                    arguments: { idea: 'AI pet sitting app' }
                }
            };

            child.stdin.write(JSON.stringify(rpcRequest) + '\n');

            // Wait for response
            setTimeout(() => {
                child.kill();
                resolve({ stdout, stderr });
            }, 12000);
        }, 3000);
    });
}

runTest().then((res) => {
    console.log('\n\n======== STDOUT (JSON-RPC responses) ========');
    // Split STDOUT by lines, filter for JSON-RPC responses
    const lines = res.stdout.split('\n').filter(l => l.trim().length > 0);
    for (const line of lines) {
        try {
            const parsed = JSON.parse(line);
            console.log('\n--- JSON-RPC Message ---');
            console.log(JSON.stringify(parsed, null, 2).substring(0, 3000));
            if (parsed.error) {
                console.log('\n!!! ERROR FOUND IN RESPONSE !!!');
                console.log('Error code:', parsed.error.code);
                console.log('Error message:', parsed.error.message);
                if (parsed.error.data) {
                    console.log('Error data:', JSON.stringify(parsed.error.data, null, 2));
                }
            }
            if (parsed.result) {
                console.log('\n+++ RESULT FOUND +++');
                // Check if result has isError
                if (parsed.result.isError) {
                    console.log('RESULT IS AN ERROR:', parsed.result.isError);
                }
                if (parsed.result.content) {
                    console.log('Content type:', typeof parsed.result.content);
                    if (Array.isArray(parsed.result.content)) {
                        for (const c of parsed.result.content) {
                            console.log('  Content item type:', c.type);
                            if (c.type === 'text') {
                                const textVal = c.text;
                                console.log('  Text preview:', textVal.substring(0, 500));
                                // Try to parse inner JSON
                                try {
                                    const inner = JSON.parse(textVal);
                                    console.log('  Parsed inner keys:', Object.keys(inner));
                                    if (inner.error) {
                                        console.log('  !!! INNER ERROR:', inner.error);
                                    }
                                    if (inner.status) {
                                        console.log('  Status:', inner.status);
                                    }
                                } catch(e) {}
                            }
                        }
                    }
                }
            }
        } catch(e) {
            // Not JSON, skip
            if (line.includes('error') || line.includes('Error') || line.includes('fail') || line.includes('FAIL')) {
                console.log('[NON-JSON interesting line]:', line.substring(0, 200));
            }
        }
    }

    console.log('\n\n======== STDERR ========');
    console.log(res.stderr);
}).catch(console.error);
