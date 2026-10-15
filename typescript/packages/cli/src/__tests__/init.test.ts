import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeCanonicalGitignore, loadCanonicalGitignore } from '../pack/canonical-gitignore.js';
import {
  jsStringLiteral,
  sanitizeServerName,
  toValidNpmPackageName,
  updateAppModuleServerName,
  updateIndexTsServerName,
  updateWidgetsPackageName,
} from '../scaffold/template-sync.js';

describe('Init Command', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should export initCommand function', async () => {
    const module = await import('../commands/init.js');
    expect(typeof module.initCommand).toBe('function');
  });

  it('writes canonical .gitignore with the shared superset rules', async () => {
    const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-gitignore-'));

    try {
      await writeCanonicalGitignore(projectDir);

      const written = await fs.readFile(path.join(projectDir, '.gitignore'), 'utf-8');
      const canonical = await loadCanonicalGitignore();

      expect(written).toBe(canonical);
      expect(written).toContain('node_modules/');
      expect(written).toContain('uploads/');
      expect(written).toContain('.env.*.local');
      expect(written).toContain('tokens.json');
      expect(written).toContain('*.pem');
      expect(await fs.pathExists(path.join(projectDir, '_gitignore'))).toBe(false);
    } finally {
      await fs.remove(projectDir);
    }
  });

  it('ships template _gitignore placeholders (not .gitignore) for npm pack', async () => {
    const templatesRoot = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../templates',
    );

    for (const template of ['typescript-starter', 'typescript-pizzaz', 'typescript-oauth']) {
      const placeholder = path.join(templatesRoot, template, '_gitignore');
      const legacy = path.join(templatesRoot, template, '.gitignore');

      expect(await fs.pathExists(placeholder)).toBe(true);
      expect(await fs.pathExists(legacy)).toBe(false);

      const content = await fs.readFile(placeholder, 'utf-8');
      expect(content).toContain('node_modules/');
      expect(content).toContain('tokens.json');
    }
  });

  describe('sanitizeServerName', () => {
    it('uses the directory leaf and keeps characters that need escaping later', () => {
      expect(sanitizeServerName('./path/to/my-mcp')).toBe('my-mcp');
      expect(sanitizeServerName("user's-\"cool\"`server`")).toBe("user's-\"cool\"`server`");
      expect(sanitizeServerName('   spaced-server   ')).toBe('spaced-server');
      expect(sanitizeServerName('')).toBe('mcp-server');
      expect(sanitizeServerName("'''")).toBe("'''");
      expect(sanitizeServerName('my\nserver')).toBe('my server');
      expect(sanitizeServerName('my\r\nserver')).toBe('my server');
      expect(sanitizeServerName('\n\r\t')).toBe('mcp-server');
      expect(sanitizeServerName('@Acme/Order Tracker')).toBe('@Acme/Order Tracker');
      expect(sanitizeServerName('@acme/orders/')).toBe('@acme/orders');
    });
  });

  describe('toValidNpmPackageName', () => {
    it('converts names into npm-compliant package names', () => {
      expect(toValidNpmPackageName('Order Tracker')).toBe('order-tracker');
      expect(toValidNpmPackageName('./path/to/My-MCP')).toBe('my-mcp');
      expect(toValidNpmPackageName("User's App")).toBe('users-app');
      expect(toValidNpmPackageName('   spaced-server   ')).toBe('spaced-server');
      expect(toValidNpmPackageName('')).toBe('mcp-server');
      expect(toValidNpmPackageName("'''")).toBe('mcp-server');
      expect(toValidNpmPackageName('my\nserver')).toBe('my-server');
      expect(toValidNpmPackageName('\n\r\t')).toBe('mcp-server');
      expect(toValidNpmPackageName('@Acme/Order Tracker')).toBe('@acme/order-tracker');
      expect(toValidNpmPackageName('@acme/orders')).toBe('@acme/orders');
    });
  });

  describe('jsStringLiteral', () => {
    it('escapes apostrophes, line breaks, and template substitutions', () => {
      expect(jsStringLiteral("John's server")).toBe("'John\\'s server'");
      expect(jsStringLiteral('line\r\nbreak')).toBe("'line\\nbreak'");
      expect(jsStringLiteral('a${b}', '`')).toBe('`a\\${b}`');
    });
  });

  describe('updateAppModuleServerName', () => {
    it('updates calculator-server in src/app.module.ts to the new project name', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-app-module-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const initialContent = `@McpApp({
  module: AppModule,
  server: {
    name: 'calculator-server',
    version: '1.0.0'
  },
  logging: {
    level: 'info'
  }
})
@Module({
  name: 'app',
  imports: [ConfigModule.forRoot(), CalculatorModule]
})
export class AppModule {}`;

        await fs.writeFile(path.join(srcDir, 'app.module.ts'), initialContent, 'utf-8');

        const updated = updateAppModuleServerName(projectDir, 'my-custom-crm-mcp');
        expect(updated).toBe(true);

        const resultContent = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
        expect(resultContent).toContain("name: 'my-custom-crm-mcp'");
        expect(resultContent).not.toContain("name: 'calculator-server'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('updates other starter template server names to the new project name', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-template-names-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const templatesToTest = [
          'airline-ticketing-server',
          'code-mode-service',
          'pizzaz-finder',
          'enterprise-search-service'
        ];

        for (const templateServerName of templatesToTest) {
          const content = `@McpApp({\n  server: {\n    name: '${templateServerName}',\n    version: '1.0.0'\n  }\n})\nexport class AppModule {}`;
          await fs.writeFile(path.join(srcDir, 'app.module.ts'), content, 'utf-8');

          const updated = updateAppModuleServerName(projectDir, 'target-project');
          expect(updated).toBe(true);

          const result = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
          expect(result).toContain("name: 'target-project'");
          expect(result).not.toContain(`name: '${templateServerName}'`);
        }
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('escapes apostrophes from path-like names and is idempotent', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-sanitize-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const content = `@McpApp({\n  server: {\n    name: 'calculator-server',\n    version: '1.0.0'\n  }\n})\nexport class AppModule {}`;
        const appModule = path.join(srcDir, 'app.module.ts');
        await fs.writeFile(appModule, content, 'utf-8');

        const updated = updateAppModuleServerName(projectDir, "./nested/user's-mcp");
        expect(updated).toBe(true);

        const result = await fs.readFile(appModule, 'utf-8');
        expect(result).toContain("name: 'user\\'s-mcp'");
        expect(result).not.toContain('calculator-server');

        const again = updateAppModuleServerName(projectDir, "./nested/user's-mcp");
        expect(again).toBe(true);
        expect(await fs.readFile(appModule, 'utf-8')).toBe(result);
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns true without rewriting when the server name already matches', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-same-name-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });
        const content = `@McpApp({\n  server: {\n    name: 'calculator-server',\n  },\n})\n`;
        const appModule = path.join(srcDir, 'app.module.ts');
        await fs.writeFile(appModule, content, 'utf-8');

        expect(updateAppModuleServerName(projectDir, 'calculator-server')).toBe(true);
        expect(await fs.readFile(appModule, 'utf-8')).toBe(content);
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('updates only the @McpApp server name when braces, comments, and decoys are present', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-braces-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });
        const content = `// server: { name: 'comment-decoy' }
const myserver = { name: 'decoy' };
@McpApp({
  /* server: { name: 'block-decoy' } */
  server: {
    serverName: 'do-not-touch',
    label: 'brace } trick',
    extensions: { foo: true },
    name: 'calculator-server',
  },
  note: 'server: { name: \\'string-decoy\\' }',
})
@Module({
  name: 'app',
})
`;
        await fs.writeFile(path.join(srcDir, 'app.module.ts'), content, 'utf-8');

        expect(updateAppModuleServerName(projectDir, 'order-tracker')).toBe(true);
        const result = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
        expect(result).toContain("name: 'order-tracker'");
        expect(result).toContain("name: 'comment-decoy'");
        expect(result).toContain("name: 'decoy'");
        expect(result).toContain("name: 'block-decoy'");
        expect(result).toContain("serverName: 'do-not-touch'");
        expect(result).toContain("label: 'brace } trick'");
        expect(result).toContain("name: 'app'");
        expect(result).not.toContain("name: 'calculator-server'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('updates each real starter template without touching the module name', async () => {
      const templatesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../templates');
      const templates = [
        { dir: 'typescript-starter', server: 'calculator-server', moduleName: 'app' },
        { dir: 'typescript-oauth', server: 'airline-ticketing-server', moduleName: 'app' },
        { dir: 'typescript-code-mode', server: 'code-mode-service', moduleName: 'app' },
        { dir: 'typescript-pizzaz', server: 'pizzaz-finder', moduleName: 'pizzaz' },
        { dir: 'typescript-enterprise-search', server: 'enterprise-search-service', moduleName: 'app' },
      ];

      for (const template of templates) {
        const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-real-template-'));
        try {
          const srcDir = path.join(projectDir, 'src');
          await fs.mkdir(srcDir, { recursive: true });
          const original = await fs.readFile(path.join(templatesRoot, template.dir, 'src', 'app.module.ts'), 'utf-8');
          await fs.writeFile(path.join(srcDir, 'app.module.ts'), original, 'utf-8');

          expect(updateAppModuleServerName(projectDir, 'order-tracker')).toBe(true);
          const result = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
          expect(result).toContain("name: 'order-tracker'");
          expect(result).not.toContain(`name: '${template.server}'`);
          expect(result).toContain(`name: '${template.moduleName}'`);
          expect(updateAppModuleServerName(projectDir, 'order-tracker')).toBe(true);
          expect(await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8')).toBe(result);
        } finally {
          await fs.remove(projectDir);
        }
      }
    });

    it('safely handles project names with special regex substitution tokens like $', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-tokens-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const content = `@McpApp({\n  server: {\n    name: 'calculator-server',\n    version: '1.0.0'\n  }\n})\nexport class AppModule {}`;
        await fs.writeFile(path.join(srcDir, 'app.module.ts'), content, 'utf-8');

        const updated = updateAppModuleServerName(projectDir, 'special$pkg$1');
        expect(updated).toBe(true);

        const result = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
        expect(result).toContain("name: 'special$pkg$1'");
        expect(result).not.toContain("name: 'calculator-server'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('normalizes newlines in project names to avoid multiline string syntax errors', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-newlines-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const content = `@McpApp({\n  server: {\n    name: 'calculator-server',\n    version: '1.0.0'\n  }\n})\nexport class AppModule {}`;
        await fs.writeFile(path.join(srcDir, 'app.module.ts'), content, 'utf-8');

        const updated = updateAppModuleServerName(projectDir, 'my\nserver');
        expect(updated).toBe(true);

        const result = await fs.readFile(path.join(srcDir, 'app.module.ts'), 'utf-8');
        expect(result).toContain("name: 'my server'");
        expect(result).not.toContain('\nserver');
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns false cleanly if no files exist', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-empty-'));

      try {
        const updated = updateAppModuleServerName(projectDir, 'any-name');
        expect(updated).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });
  });

  describe('updateIndexTsServerName', () => {
    it('updates createServer name in src/index.ts to the new project name', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-index-ts-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const content = `import { createServer } from '@nitrostack/core';
const server = createServer({
  name: 'default-mcp-server',
  version: '1.0.0'
});`;
        await fs.writeFile(path.join(srcDir, 'index.ts'), content, 'utf-8');

        const updated = updateIndexTsServerName(projectDir, 'my-custom-service');
        expect(updated).toBe(true);

        const result = await fs.readFile(path.join(srcDir, 'index.ts'), 'utf-8');
        expect(result).toContain("name: 'my-custom-service'");
        expect(result).not.toContain("name: 'default-mcp-server'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('updates createServer name that follows a nested object and leaves decoys alone', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-index-nested-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });
        const content = `const myserver = { name: 'decoy' };
const server = createServer({
  extensions: { foo: true },
  name: 'default-mcp-server',
  description: 'John\\'s server',
});
`;
        await fs.writeFile(path.join(srcDir, 'index.ts'), content, 'utf-8');

        expect(updateIndexTsServerName(projectDir, "user's-mcp")).toBe(true);
        const result = await fs.readFile(path.join(srcDir, 'index.ts'), 'utf-8');
        expect(result).toContain("name: 'user\\'s-mcp'");
        expect(result).toContain("name: 'decoy'");
        expect(result).toContain("description: 'John\\'s server'");
        expect(result).not.toContain("name: 'default-mcp-server'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns false cleanly if src/index.ts does not exist', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-no-index-'));

      try {
        const updated = updateIndexTsServerName(projectDir, 'any-name');
        expect(updated).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });
  });

  describe('updateWidgetsPackageName', () => {
    it('updates widget package.json name to ${projectName}-widgets', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-widgets-'));

      try {
        const widgetsDir = path.join(projectDir, 'src', 'widgets');
        await fs.mkdir(widgetsDir, { recursive: true });

        const pkgJson = {
          name: 'calculator-widgets',
          version: '0.1.0',
          private: true
        };
        await fs.writeJSON(path.join(widgetsDir, 'package.json'), pkgJson);

        const updated = updateWidgetsPackageName(projectDir, 'cool-analytics');
        expect(updated).toBe(true);

        const resultPkg = await fs.readJSON(path.join(widgetsDir, 'package.json'));
        expect(resultPkg.name).toBe('cool-analytics-widgets');
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('sanitizes names with spaces to produce valid npm package names', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-widgets-spaces-'));

      try {
        const widgetsDir = path.join(projectDir, 'src', 'widgets');
        await fs.mkdir(widgetsDir, { recursive: true });

        const pkgJson = {
          name: 'calculator-widgets',
          version: '0.1.0',
          private: true
        };
        await fs.writeJSON(path.join(widgetsDir, 'package.json'), pkgJson);

        const updated = updateWidgetsPackageName(projectDir, 'Order Tracker');
        expect(updated).toBe(true);

        const resultPkg = await fs.readJSON(path.join(widgetsDir, 'package.json'));
        expect(resultPkg.name).toBe('order-tracker-widgets');
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns false cleanly if widgets package.json is missing', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-no-widgets-'));

      try {
        const updated = updateWidgetsPackageName(projectDir, 'cool-analytics');
        expect(updated).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('keeps a scoped package name and does not rewrite an already-correct file', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-widgets-scope-'));

      try {
        const widgetsDir = path.join(projectDir, 'src', 'widgets');
        await fs.mkdir(widgetsDir, { recursive: true });
        const pkgPath = path.join(widgetsDir, 'package.json');
        const raw = '{\n    "name": "calculator-widgets",\n    "version": "1.0.0"\n}\n';
        await fs.writeFile(pkgPath, raw, 'utf-8');

        expect(updateWidgetsPackageName(projectDir, '@Acme/Order Tracker')).toBe(true);
        expect((await fs.readJSON(pkgPath)).name).toBe('@acme/order-tracker-widgets');

        const formatted = await fs.readFile(pkgPath, 'utf-8');
        expect(updateWidgetsPackageName(projectDir, '@Acme/Order Tracker')).toBe(true);
        expect(await fs.readFile(pkgPath, 'utf-8')).toBe(formatted);
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('preserves formatting when the widget package name is already correct', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-widgets-fmt-'));

      try {
        const widgetsDir = path.join(projectDir, 'src', 'widgets');
        await fs.mkdir(widgetsDir, { recursive: true });
        const pkgPath = path.join(widgetsDir, 'package.json');
        const raw = '{\n    "name": "order-tracker-widgets",\n    "version": "1.0.0"\n}\n';
        await fs.writeFile(pkgPath, raw, 'utf-8');

        expect(updateWidgetsPackageName(projectDir, 'Order Tracker')).toBe(true);
        expect(await fs.readFile(pkgPath, 'utf-8')).toBe(raw);
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns false when widgets package.json is invalid', async () => {
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-widgets-bad-'));

      try {
        const widgetsDir = path.join(projectDir, 'src', 'widgets');
        await fs.mkdir(widgetsDir, { recursive: true });
        await fs.writeFile(path.join(widgetsDir, 'package.json'), '{', 'utf-8');
        expect(updateWidgetsPackageName(projectDir, 'cool-analytics')).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });
  });
});
