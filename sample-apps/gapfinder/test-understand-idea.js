import { spawn } from 'child_process';
import 'dotenv/config';

// JSON-RPC tool call payload for understand_idea
const toolCallRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
        name: 'understand_idea',
        arguments: {
            idea: 'A platform that helps college students prepare for AI interviews with automated feedback',
            industry: 'EdTech',
            geography: 'India'
        }
    }
};

async function testUnderstandIdea() {
    console.log('Spawning MCP Server node dist/index.js...');
    const child = spawn('node', ['dist/index.js'], {
        env: {
            ...process.env,
            NITRO_LOG_LEVEL: 'debug'
        }
    });

    child.stdout.on('data', (data) => {
        console.log('[STDOUT]', data.toString().trim());
    });

    child.stderr.on('data', (data) => {
        console.error('[STDERR]', data.toString().trim());
    });

    console.log('Sending JSON-RPC request for understand_idea...');
    child.stdin.write(JSON.stringify(toolCallRequest) + '\n');

    // Wait 15 seconds and terminate child
    await new Promise((resolve) => setTimeout(resolve, 15000));
    console.log('Terminating child...');
    child.kill();

    console.log('--- TEST FINISHED ---');
}

testUnderstandIdea();
