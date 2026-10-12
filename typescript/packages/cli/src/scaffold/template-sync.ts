import fs from 'fs-extra';
import path from 'path';

/**
 * Sanitizes a project name for use as an MCP server name:
 * - Extracts the basename if a path was provided (e.g., './my-mcp' -> 'my-mcp')
 * - Strips single quotes, double quotes, backticks, and backslashes to ensure safe code interpolation
 * - Falls back to 'mcp-server' if empty after sanitization
 */
export function sanitizeServerName(name: string): string {
  if (!name) {
    return 'mcp-server';
  }
  const baseName = path.basename(name.trim());
  const sanitized = baseName.replace(/['"\\`]/g, '').trim();
  return sanitized || 'mcp-server';
}

/**
 * Safely replaces patterns in a file using a replacer callback to avoid regex substitution token issues.
 */
export function replaceInFile(
  filePath: string,
  regex: RegExp,
  replacer: (substring: string, ...args: (string | number)[]) => string
): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  const replaced = original.replace(regex, replacer as (substring: string, ...args: any[]) => string);
  if (replaced !== original) {
    fs.writeFileSync(filePath, replaced, 'utf8');
    return true;
  }
  return false;
}

/**
 * Updates the MCP server name in src/app.module.ts to match the project name.
 */
export function updateAppModuleServerName(targetDir: string, serverName: string): boolean {
  const sanitized = sanitizeServerName(serverName);
  const appModulePath = path.join(targetDir, 'src', 'app.module.ts');

  return replaceInFile(
    appModulePath,
    /(server\s*:\s*\{[^}]*?\bname\s*:\s*['"])([^'"]+)(['"])/s,
    (_, prefix, _oldName, suffix) => `${prefix}${sanitized}${suffix}`
  );
}

/**
 * Updates the widget package name in src/widgets/package.json if present.
 */
export function updateWidgetsPackageName(targetDir: string, projectName: string): boolean {
  const sanitized = sanitizeServerName(projectName);
  const widgetsPkgPath = path.join(targetDir, 'src', 'widgets', 'package.json');
  if (fs.existsSync(widgetsPkgPath)) {
    try {
      const pkg = fs.readJSONSync(widgetsPkgPath);
      pkg.name = `${sanitized}-widgets`;
      fs.writeJSONSync(widgetsPkgPath, pkg, { spaces: 2 });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
