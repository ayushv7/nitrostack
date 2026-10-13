import { spawn } from 'child_process';
import 'dotenv/config';

// JSON-RPC tool call payload
const toolCallRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
        name: 'discover_competitors',
        arguments: {
            category: 'EdTech',
            problem: 'Students struggle to prepare for interviews.',
            targetUser: 'College students',
            valueProp: 'AI-powered interview preparation',
            keywords: ['AI interview', 'mock interview', 'technical interview'],
            geography: 'India'
        }
    }
};

async function testMcpCall() {
    console.log('Spawning MCP Server node dist/index.js...');
    const child = spawn('node', ['dist/index.js'], {
        env: {
            ...process.env,
            NITRO_LOG_LEVEL: 'debug'
        }
    });

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
        stdoutData += data.toString();
        console.log('[STDOUT]', data.toString().trim());
    });

    child.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.error('[STDERR]', data.toString().trim());
    });

    // Write the request to stdin (standard JSON-RPC format with newline)
    console.log('Sending JSON-RPC request for discover_competitors...');
    child.stdin.write(JSON.stringify(toolCallRequest) + '\n');

    // Wait 20 seconds and terminate the child
    await new Promise((resolve) => setTimeout(resolve, 20000));
    console.log('Terminating child...');
    child.kill();

    console.log('--- TEST FINISHED ---');
}

testMcpCall();
