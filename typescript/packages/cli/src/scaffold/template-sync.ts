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

type Quote = "'" | '"' | '`';

const LINE_BREAKS = /[\r\n\t\u2028\u2029]+/g;

/**
 * Project name used as the MCP server name.
 * Collapses line breaks, keeps a scoped name like `@scope/pkg`, and uses the
 * last path segment for directory-style input. Characters are preserved so the
 * advertised name still matches what the user typed; callers escape them when
 * writing JavaScript source.
 */
export function sanitizeServerName(name: string): string {
  if (!name) return 'mcp-server';
  const cleaned = name.replace(LINE_BREAKS, ' ').trim().replace(/[/\\]+$/, '');
  if (!cleaned) return 'mcp-server';
  const leaf = leafProjectName(cleaned).trim();
  if (!leaf || leaf === '.' || leaf === '..') return 'mcp-server';
  return leaf;
}

/**
 * npm package name for the same project.
 * Scoped names stay scoped (`@Acme/Order Tracker` → `@acme/order-tracker`).
 * Paths use the last segment. Empty results fall back to `mcp-server`.
 */
export function toValidNpmPackageName(name: string): string {
  if (!name) return 'mcp-server';
  const cleaned = name.replace(LINE_BREAKS, ' ').trim();
  if (!cleaned) return 'mcp-server';

  const scoped = cleaned.match(/^@([^/\\]+)[/\\](.+)$/);
  if (scoped) {
    const scope = slugNpmSegment(scoped[1]);
    const pkg = slugNpmSegment(leafProjectName(scoped[2]));
    if (scope && pkg) return `@${scope}/${pkg}`;
  }

  return slugNpmSegment(leafProjectName(cleaned)) || 'mcp-server';
}

/** Widget package name derived from the project name, including a preserved scope. */
export function widgetPackageName(projectName: string): string {
  const npmName = toValidNpmPackageName(projectName);
  const slash = npmName.indexOf('/');
  if (npmName.startsWith('@') && slash > 0) {
    return `${npmName.slice(0, slash)}/${npmName.slice(slash + 1)}-widgets`;
  }
  return `${npmName}-widgets`;
}

/** JavaScript string literal, including quotes. */
export function jsStringLiteral(value: string, quote: Quote = "'"): string {
  return quote + escapeJsStringContents(value, quote) + quote;
}

/**
 * Writes `serverName` into the `@McpApp` `server.name` literal.
 * Returns true when that property exists, including when it already matches.
 */
export function updateAppModuleServerName(targetDir: string, serverName: string): boolean {
  return replaceSourceFile(
    path.join(targetDir, 'src', 'app.module.ts'),
    sanitizeServerName(serverName),
    replaceMcpAppServerName,
  );
}

/**
 * Writes `serverName` into `createServer({ name })` in `src/index.ts`.
 * Returns true when that property exists, including when it already matches.
 */
export function updateIndexTsServerName(targetDir: string, serverName: string): boolean {
  return replaceSourceFile(
    path.join(targetDir, 'src', 'index.ts'),
    sanitizeServerName(serverName),
    replaceCreateServerName,
  );
}

/**
 * Sets `src/widgets/package.json` `name` to a valid npm name.
 * Leaves the file untouched when the name is already correct.
 */
export function updateWidgetsPackageName(targetDir: string, projectName: string): boolean {
  const nextName = widgetPackageName(projectName);
  const widgetsPkgPath = path.join(targetDir, 'src', 'widgets', 'package.json');
  if (!fs.existsSync(widgetsPkgPath)) return false;
  try {
    const pkg = fs.readJSONSync(widgetsPkgPath) as { name?: string };
    if (!pkg || typeof pkg !== 'object' || Array.isArray(pkg)) return false;
    if (pkg.name === nextName) return true;
    pkg.name = nextName;
    fs.writeJSONSync(widgetsPkgPath, pkg, { spaces: 2 });
    return true;
  } catch {
    return false;
  }
}

function leafProjectName(name: string): string {
  const withoutTrailingSep = name.replace(/[/\\]+$/, '');
  // npm scopes use a single forward slash. path.basename would keep only the package part.
  const scoped = withoutTrailingSep.match(/^@([^/]+)\/([^/]+)$/);
  if (scoped) return `@${scoped[1]}/${scoped[2]}`;
  // Match the directory path.join will create on this platform.
  return path.basename(withoutTrailingSep);
}

function slugNpmSegment(segment: string): string {
  return segment
    .toLowerCase()
    .replace(/['"\\`]/g, '')
    .replace(/[^a-z0-9._~-]/g, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
    .replace(/-+/g, '-');
}

function escapeJsStringContents(value: string, quote: Quote): string {
  let escaped = '';
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === '\r' && value[i + 1] === '\n') {
      escaped += '\\n';
      i++;
      continue;
    }
    if (ch === '\\') escaped += '\\\\';
    else if (ch === quote) escaped += '\\' + quote;
    else if (ch === '\n' || ch === '\r' || ch === '\u2028' || ch === '\u2029') escaped += '\\n';
    else if (ch === '\t') escaped += '\\t';
    else if (ch === '\0') escaped += '\\0';
    else if (ch.charCodeAt(0) < 0x20) {
      escaped += '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    } else if (quote === '`' && ch === '$' && value[i + 1] === '{') {
      escaped += '\\${';
      i++;
    } else escaped += ch;
  }
  return escaped;
}

function replaceSourceFile(
  filePath: string,
  serverName: string,
  replace: (source: string, serverName: string) => string | null,
): boolean {
  if (!fs.existsSync(filePath)) return false;
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = replace(original, serverName);
  if (updated == null) return false;
  if (updated !== original) fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

function replaceMcpAppServerName(source: string, serverName: string): string | null {
  const decorator = findDecoratorObjectRange(source, 'McpApp');
  if (!decorator) return null;
  const serverBrace = findKeyedObjectBrace(source, decorator.bodyStart, decorator.bodyEnd, 'server');
  if (serverBrace === -1) return null;
  return replaceTopLevelName(source, serverBrace, serverName);
}

function replaceCreateServerName(source: string, serverName: string): string | null {
  const openBrace = findCalleeObjectBrace(source, 'createServer');
  if (openBrace === -1) return null;
  return replaceTopLevelName(source, openBrace, serverName);
}

function replaceTopLevelName(source: string, openBrace: number, serverName: string): string | null {
  const close = findMatchingBrace(source, openBrace);
  if (close === -1) return null;
  const literal = findNameLiteral(source, openBrace + 1, close);
  if (!literal) return null;
  const escaped = escapeJsStringContents(serverName, literal.quote);
  if (escaped === literal.raw) return source;
  return source.slice(0, literal.start) + literal.quote + escaped + literal.quote + source.slice(literal.end);
}

interface StringLiteral {
  start: number;
  end: number;
  quote: Quote;
  raw: string;
}

interface ObjectRange {
  bodyStart: number;
  bodyEnd: number;
}

function findDecoratorObjectRange(source: string, name: string): ObjectRange | null {
  const needle = `@${name}`;
  let i = 0;
  while (i < source.length) {
    if (source[i] === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
      const next = skipComment(source, i, source.length);
      if (next <= i) return null;
      i = next;
      continue;
    }
    if (isQuote(source[i])) {
      const lit = readString(source, i);
      if (!lit) return null;
      i = lit.end;
      continue;
    }
    if (source.startsWith(needle, i) && !isIdentPart(source[i + needle.length] ?? '')) {
      let j = skipSpace(source, i + needle.length);
      if (source[j] === '(') {
        j = skipSpace(source, j + 1);
        if (source[j] === '{') {
          const close = findMatchingBrace(source, j);
          if (close === -1) return null;
          return { bodyStart: j + 1, bodyEnd: close };
        }
      }
    }
    i++;
  }
  return null;
}

function findCalleeObjectBrace(source: string, callee: string): number {
  let i = 0;
  while (i < source.length) {
    if (source[i] === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
      const next = skipComment(source, i, source.length);
      if (next <= i) return -1;
      i = next;
      continue;
    }
    if (isQuote(source[i])) {
      const lit = readString(source, i);
      if (!lit) return -1;
      i = lit.end;
      continue;
    }
    if (isIdentStart(source[i])) {
      const ident = readIdentifier(source, i);
      i = ident.next;
      if (ident.name === callee) {
        let j = skipSpace(source, i);
        if (source[j] === '(') {
          j = skipSpace(source, j + 1);
          if (source[j] === '{') return j;
        }
      }
      continue;
    }
    i++;
  }
  return -1;
}

function findKeyedObjectBrace(source: string, from: number, to: number, key: string): number {
  let cursor = from;
  while (cursor < to) {
    const afterKey = positionAfterTopLevelKey(source, cursor, to, key);
    if (afterKey === -1) return -1;
    let j = skipSpace(source, afterKey);
    if (source[j] === ':') {
      j = skipSpace(source, j + 1);
      if (source[j] === '{') return j;
    }
    if (afterKey <= cursor) return -1;
    cursor = afterKey;
  }
  return -1;
}

function findNameLiteral(source: string, from: number, to: number): StringLiteral | null {
  let cursor = from;
  while (cursor < to) {
    const afterKey = positionAfterTopLevelKey(source, cursor, to, 'name');
    if (afterKey === -1) return null;
    let j = skipSpace(source, afterKey);
    if (source[j] === ':') {
      j = skipSpace(source, j + 1);
      if (isQuote(source[j] ?? '')) {
        const lit = readString(source, j);
        if (!lit || lit.end > to) return null;
        return lit;
      }
    }
    if (afterKey <= cursor) return null;
    cursor = afterKey;
  }
  return null;
}

function positionAfterTopLevelKey(source: string, from: number, to: number, key: string): number {
  let i = from;
  let depth = 0;
  while (i < to) {
    const ch = source[i];
    if (ch === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
      const next = skipComment(source, i, to);
      if (next <= i) return -1;
      i = next;
      continue;
    }
    if (isQuote(ch)) {
      const lit = readString(source, i);
      if (!lit || lit.end > to) return -1;
      i = lit.end;
      continue;
    }
    if (ch === '{' || ch === '[' || ch === '(') {
      depth++;
      i++;
      continue;
    }
    if (ch === '}' || ch === ']' || ch === ')') {
      if (depth > 0) depth--;
      i++;
      continue;
    }
    if (depth === 0 && isIdentStart(ch)) {
      const ident = readIdentifier(source, i);
      i = ident.next;
      if (ident.name === key) return i;
      continue;
    }
    i++;
  }
  return -1;
}

function findMatchingBrace(source: string, openIndex: number): number {
  if (source[openIndex] !== '{') return -1;
  let depth = 0;
  let i = openIndex;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
      const next = skipComment(source, i, source.length);
      if (next <= i) return -1;
      i = next;
      continue;
    }
    if (isQuote(ch)) {
      const lit = readString(source, i);
      if (!lit) return -1;
      i = lit.end;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return -1;
}

function readString(source: string, start: number): StringLiteral | null {
  const quote = source[start] as Quote;
  if (!isQuote(quote)) return null;
  let raw = '';
  let i = start + 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      if (i + 1 >= source.length) return null;
      raw += ch + source[i + 1];
      i += 2;
      continue;
    }
    if (ch === quote) return { start, end: i + 1, quote, raw };
    if ((ch === '\n' || ch === '\r') && quote !== '`') return null;
    raw += ch;
    i++;
  }
  return null;
}

function readIdentifier(source: string, index: number): { name: string; next: number } {
  let i = index + 1;
  while (i < source.length && isIdentPart(source[i])) i++;
  return { name: source.slice(index, i), next: i };
}

function skipComment(source: string, index: number, limit: number): number {
  if (source.startsWith('//', index)) {
    const nl = source.indexOf('\n', index);
    if (nl === -1 || nl >= limit) return limit;
    return nl + 1;
  }
  const end = source.indexOf('*/', index + 2);
  if (end === -1) return limit;
  return Math.min(limit, end + 2);
}

function skipSpace(source: string, index: number): number {
  let i = index;
  while (i < source.length && /\s/.test(source[i])) i++;
  return i;
}

function isQuote(ch: string | undefined): ch is Quote {
  return ch === "'" || ch === '"' || ch === '`';
}

function isIdentStart(ch: string | undefined): boolean {
  return !!ch && /[A-Za-z_$]/.test(ch);
}

function isIdentPart(ch: string | undefined): boolean {
  return !!ch && /[A-Za-z0-9_$]/.test(ch);
}
