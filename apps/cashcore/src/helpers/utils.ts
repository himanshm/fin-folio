import { fileURLToPath } from 'url';
import { join, dirname as getDirname } from 'path';
import { readFileSync } from 'fs';

export const normalisePort = (val: string): string | number | false => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
};

/**
 * Reads and parses a JSON file relative to the given `import.meta.url`.
 *
 * @param metaUrl The import.meta.url of the caller module.
 * @param relativePath The path to the JSON file relative to the caller module's directory.
 * @returns Parsed JSON object.
 */

export const readJsonFile = <T>(metaUrl: string, relativePath: string): T => {
  const baseDir = getDirname(fileURLToPath(new URL('.', metaUrl))); // Convert the module's url into a file path
  const fullPath = join(baseDir, relativePath);
  const contents = readFileSync(fullPath, 'utf-8'); // read the contents of the file as a UTF-8 string
  return JSON.parse(contents) as T; // Parse it from JSON to javascript object and return
};
