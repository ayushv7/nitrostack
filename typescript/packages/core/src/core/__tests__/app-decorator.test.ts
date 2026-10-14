import { describe, it, expect } from '@jest/globals';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import 'reflect-metadata';
import { McpApp, getMcpAppMetadata, McpAppOptions, readLocalPackageManifest, resolveServerIdentity } from '../app-decorator.js';
import { Module } from '../module.js';

describe('App Decorator', () => {
    describe('@McpApp decorator', () => {
        it('should mark class with metadata', () => {
            @Module({ name: 'test' })
            class TestModule { }

            @McpApp({ module: TestModule })
            class TestApp { }

            const metadata = getMcpAppMetadata(TestApp);
            expect(metadata).toBeDefined();
            expect(metadata?.module).toBe(TestModule);
        });

        it('should store server options', () => {
            @Module({ name: 'test' })
            class TestModule { }

            @McpApp({
                module: TestModule,
                server: {
                    name: 'test-server',
                    version: '1.2.3'
                }
            })
            class TestApp { }

            const metadata = getMcpAppMetadata(TestApp);
            expect(metadata?.server?.name).toBe('test-server');
            expect(metadata?.server?.version).toBe('1.2.3');
        });

        it('should store logging options', () => {
            @Module({ name: 'test' })
            class TestModule { }

            @McpApp({
                module: TestModule,
                logging: { level: 'debug' }
            })
            class TestApp { }

            const metadata = getMcpAppMetadata(TestApp);
            expect(metadata?.logging?.level).toBe('debug');
        });

        it('should store transport options', () => {
            @Module({ name: 'test' })
            class TestModule { }

            @McpApp({
                module: TestModule,
                transport: {
                    type: 'http',
                    http: {
                        port: 3000,
                        host: '0.0.0.0',
                        basePath: '/api'
                    }
                }
            })
            class TestApp { }

            const metadata = getMcpAppMetadata(TestApp);
            expect(metadata?.transport?.type).toBe('http');
            expect(metadata?.transport?.http?.port).toBe(3000);
        });
    });

    describe('getMcpAppMetadata', () => {
        it('should return undefined for non-decorated classes', () => {
            class RegularClass { }
            expect(getMcpAppMetadata(RegularClass)).toBeUndefined();
        });
    });

    describe('resolveServerIdentity', () => {
        it('prefers an explicit server name and version', () => {
            expect(resolveServerIdentity(
                { name: 'explicit', version: '9.9.9' },
                { name: 'from-pkg', version: '1.2.3' },
            )).toEqual({ name: 'explicit', version: '9.9.9' });
        });

        it('uses the package manifest when server fields are omitted', () => {
            expect(resolveServerIdentity(
                {},
                { name: 'from-pkg', version: '1.2.3' },
            )).toEqual({ name: 'from-pkg', version: '1.2.3' });
        });

        it('falls back when both sides are missing or blank', () => {
            expect(resolveServerIdentity(undefined, {})).toEqual({ name: 'mcp-server', version: '1.0.0' });
            expect(resolveServerIdentity(
                { name: '   ', version: '' },
                { name: 'from-pkg', version: '   ' },
            )).toEqual({ name: 'from-pkg', version: '1.0.0' });
        });

        it('does not read npm_package_name from the environment', () => {
            const previousName = process.env.npm_package_name;
            const previousVersion = process.env.npm_package_version;
            process.env.npm_package_name = 'inherited-from-npm';
            process.env.npm_package_version = '9.9.9';
            try {
                expect(resolveServerIdentity(undefined, {})).toEqual({ name: 'mcp-server', version: '1.0.0' });
            } finally {
                if (previousName === undefined) delete process.env.npm_package_name;
                else process.env.npm_package_name = previousName;
                if (previousVersion === undefined) delete process.env.npm_package_version;
                else process.env.npm_package_version = previousVersion;
            }
        });
    });

    describe('readLocalPackageManifest', () => {
        it('reads name and version from a directory', () => {
            const dir = mkdtempSync(join(tmpdir(), 'nitro-manifest-'));
            try {
                writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: '@acme/orders', version: '3.1.0' }));
                expect(readLocalPackageManifest(dir)).toEqual({ name: '@acme/orders', version: '3.1.0' });
            } finally {
                rmSync(dir, { recursive: true, force: true });
            }
        });

        it('returns an empty manifest when package.json is missing or invalid', () => {
            const missing = mkdtempSync(join(tmpdir(), 'nitro-manifest-missing-'));
            const invalid = mkdtempSync(join(tmpdir(), 'nitro-manifest-invalid-'));
            try {
                expect(readLocalPackageManifest(missing)).toEqual({});
                writeFileSync(join(invalid, 'package.json'), '{');
                expect(readLocalPackageManifest(invalid)).toEqual({});
            } finally {
                rmSync(missing, { recursive: true, force: true });
                rmSync(invalid, { recursive: true, force: true });
            }
        });
    });

    describe('package entry exports', () => {
        it('exports resolveServerIdentity and readLocalPackageManifest from core index', async () => {
            const index = await import('../index.js');
            expect(typeof index.resolveServerIdentity).toBe('function');
            expect(typeof index.readLocalPackageManifest).toBe('function');
            expect(index.resolveServerIdentity).toBe(resolveServerIdentity);
            expect(index.readLocalPackageManifest).toBe(readLocalPackageManifest);
        });
    });
});
