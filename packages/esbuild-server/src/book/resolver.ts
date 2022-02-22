import { glob } from 'glob';
import { promisify } from 'util';

export async function resolveFiles (globs: string[]): Promise<string[]> {
  const results = await Promise.all(globs.map(pattern => promisify(glob)(pattern)));
  return Array.from(new Set(results.flat(1)));
}
