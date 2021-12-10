import { FC } from 'react'

import { Story } from './main';

export type Stories = Record<string, {
  title: string
  stories: Record<string, FC>
  source: string
}>

export function extractStories(modules: Record<string, Story>, basePath: string): Stories {
  const res: Stories = {}

  for (const file of Object.keys(modules)) {
    const key = convertFileNameToPathSegment(file, basePath);

    const { module, source } = modules[file];
    res[key] = {
      title: module.default?.title ?? key,
      stories: {},
      source
    };

    for (const comp of Object.keys(module)) {
      if (typeof module[comp] === 'function') {
        res[key].stories[comp] = module[comp];
      }
    }
  }

  return res;
}

function convertFileNameToPathSegment(filename: string, basePath: string) {
  if (filename.startsWith(basePath)) {
    filename = filename.slice(basePath.length);
  }

  if (filename.startsWith('/')) {
    filename = filename.slice(1);
  }

  return filename.trim().replace(/[-\.\/]/g, '-');
}
