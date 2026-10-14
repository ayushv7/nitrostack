import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createWidgetEntryCode } from '../commands/build.js';

describe('Build Command', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should export buildCommand function', async () => {
    const module = await import('../commands/build.js');
    expect(typeof module.buildCommand).toBe('function');
  });

  describe('createWidgetEntryCode', () => {
    it('escapes paths with apostrophes on Windows so esbuild parses valid JS', () => {
      const windowsPathWithApostrophe =
        "C:\\Users\\admin\\Documents\\Beta-App-Testing\\Bob's Fast MCP\\src\\widgets\\app\\calculator-result\\page.tsx";
      const code = createWidgetEntryCode(windowsPathWithApostrophe);

      // Verify the generated import uses valid double quotes without syntax error
      expect(code).toContain(
        'import WidgetPage from "C:/Users/admin/Documents/Beta-App-Testing/Bob\'s Fast MCP/src/widgets/app/calculator-result/page.tsx";'
      );

      // Verify esbuild transforms it cleanly without syntax errors (e.g. Expected ";" but found "s")
      expect(() => {
        esbuild.transformSync(code, { loader: 'jsx' });
      }).not.toThrow();
    });

    it('escapes paths with apostrophes on Unix', () => {
      const unixPathWithApostrophe = "/home/user/Bob's Fast MCP/src/widgets/app/page.tsx";
      const code = createWidgetEntryCode(unixPathWithApostrophe);

      expect(code).toContain(
        'import WidgetPage from "/home/user/Bob\'s Fast MCP/src/widgets/app/page.tsx";'
      );

      expect(() => {
        esbuild.transformSync(code, { loader: 'jsx' });
      }).not.toThrow();
    });

    it('escapes paths with double quotes and spaces safely', () => {
      const pathWithDoubleQuotes = '/home/user/test "special" app/src/widgets/app/page.tsx';
      const code = createWidgetEntryCode(pathWithDoubleQuotes);

      expect(code).toContain(
        'import WidgetPage from "/home/user/test \\"special\\" app/src/widgets/app/page.tsx";'
      );

      expect(() => {
        esbuild.transformSync(code, { loader: 'jsx' });
      }).not.toThrow();
    });

    it('normalizes Windows backslashes to forward slashes in import statements', () => {
      const windowsPath = 'C:\\Project\\Widgets\\app\\test\\page.tsx';
      const code = createWidgetEntryCode(windowsPath);

      expect(code).toContain('import WidgetPage from "C:/Project/Widgets/app/test/page.tsx";');
      expect(code).not.toContain('C:\\Project');
    });

    it('bundles a widget page in a folder path with an apostrophe via esbuild without syntax error', async () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "bob's-widget-mcp-"));
      try {
        const outDir = path.join(tmpDir, 'out');
        fs.mkdirSync(outDir, { recursive: true });

        const pageFile = path.join(tmpDir, 'page.tsx');
        fs.writeFileSync(pageFile, 'export default function WidgetPage() { return <div>Bob</div>; }');

        const tempEntry = path.join(outDir, '_temp_test.jsx');
        const jsOutput = path.join(outDir, 'test.js');
        const entryCode = createWidgetEntryCode(pageFile);
        fs.writeFileSync(tempEntry, entryCode);

        await esbuild.build({
          entryPoints: [tempEntry],
          bundle: true,
          format: 'iife',
          outfile: jsOutput,
          platform: 'browser',
          target: ['es2020'],
          jsx: 'transform',
          external: ['react', 'react-dom', 'react-dom/client'],
          logLevel: 'silent',
        });

        expect(fs.existsSync(jsOutput)).toBe(true);
        const bundledJs = fs.readFileSync(jsOutput, 'utf8');
        expect(bundledJs).toContain('WidgetPage');
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });
  });
});
