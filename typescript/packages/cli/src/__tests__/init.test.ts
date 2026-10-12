import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeCanonicalGitignore, loadCanonicalGitignore } from '../pack/canonical-gitignore.js';

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

  describe('updateAppModuleServerName', () => {
    it('updates calculator-server in src/app.module.ts to the new project name', async () => {
      const { updateAppModuleServerName } = await import('../commands/init.js');
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
      const { updateAppModuleServerName } = await import('../commands/init.js');
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

    it('updates createServer name in src/index.ts if present', async () => {
      const { updateAppModuleServerName } = await import('../commands/init.js');
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-createserver-'));

      try {
        const srcDir = path.join(projectDir, 'src');
        await fs.mkdir(srcDir, { recursive: true });

        const indexContent = `const server = createServer({\n  name: 'old-server-name',\n  version: '1.0.0',\n});\nserver.start();`;
        await fs.writeFile(path.join(srcDir, 'index.ts'), indexContent, 'utf-8');

        const updated = updateAppModuleServerName(projectDir, 'new-server-name');
        expect(updated).toBe(true);

        const result = await fs.readFile(path.join(srcDir, 'index.ts'), 'utf-8');
        expect(result).toContain("name: 'new-server-name'");
        expect(result).not.toContain("name: 'old-server-name'");
      } finally {
        await fs.remove(projectDir);
      }
    });

    it('returns false cleanly if no files exist', async () => {
      const { updateAppModuleServerName } = await import('../commands/init.js');
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-empty-'));

      try {
        const updated = updateAppModuleServerName(projectDir, 'any-name');
        expect(updated).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });
  });

  describe('updateWidgetsPackageName', () => {
    it('updates widget package.json name to ${projectName}-widgets', async () => {
      const { updateWidgetsPackageName } = await import('../commands/init.js');
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

    it('returns false cleanly if widgets package.json is missing', async () => {
      const { updateWidgetsPackageName } = await import('../commands/init.js');
      const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nitro-init-no-widgets-'));

      try {
        const updated = updateWidgetsPackageName(projectDir, 'cool-analytics');
        expect(updated).toBe(false);
      } finally {
        await fs.remove(projectDir);
      }
    });
  });
});
