/**
 * Copyright 2025 Nitrostack Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
 * Converts a project name or arbitrary string into a valid npm package name:
 * - Extracts basename if a path or scoped package is provided
 * - Converts to lowercase
 * - Replaces whitespace, underscores, and disallowed characters with hyphens
 * - Collapses consecutive hyphens and trims leading/trailing hyphens
 * - Falls back to 'mcp-server' if empty
 */
export function toValidNpmPackageName(name: string): string {
  if (!name) {
    return 'mcp-server';
  }
  const baseName = path.basename(name.trim());
  const normalized = baseName
    .toLowerCase()
    .replace(/['"\\`]/g, '')
    .replace(/[^a-z0-9._~-]/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
    .replace(/-+/g, '-');

  return normalized || 'mcp-server';
}

/**
 * Safely replaces patterns in a file using a replacer callback to avoid regex substitution token issues.
 */
export function replaceInFile(
  filePath: string,
  regex: RegExp,
  replacer: (substring: string, ...args: any[]) => string
): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  const replaced = original.replace(regex, replacer);
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
 * Updates the MCP server name in src/index.ts if createServer({ name: '...' }) is used.
 */
export function updateIndexTsServerName(targetDir: string, serverName: string): boolean {
  const sanitized = sanitizeServerName(serverName);
  const indexTsPath = path.join(targetDir, 'src', 'index.ts');

  return replaceInFile(
    indexTsPath,
    /(createServer\s*\(\s*\{[^}]*?\bname\s*:\s*['"])([^'"]+)(['"])/s,
    (_, prefix, _oldName, suffix) => `${prefix}${sanitized}${suffix}`
  );
}

/**
 * Updates the widget package name in src/widgets/package.json if present.
 * Ensures the package name is npm-compliant even when the project name has spaces or capital letters.
 */
export function updateWidgetsPackageName(targetDir: string, projectName: string): boolean {
  const npmPackageName = toValidNpmPackageName(projectName);
  const widgetsPkgPath = path.join(targetDir, 'src', 'widgets', 'package.json');
  if (fs.existsSync(widgetsPkgPath)) {
    try {
      const pkg = fs.readJSONSync(widgetsPkgPath);
      pkg.name = `${npmPackageName}-widgets`;
      fs.writeJSONSync(widgetsPkgPath, pkg, { spaces: 2 });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
