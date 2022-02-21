import { FunctionComponent } from 'react'

export interface Story {
  path: string
  module: any
  source: string
}

export type StoryMap = Record<string, {
  title: string
  source: string
  stories: Record<string, FunctionComponent>
}>

export function extractStories(stories: Story[], basePath: string): StoryMap {
  const res: StoryMap = {}

  stories.forEach(({ path, module, source }) => {
    const key = convertFileNameToPathSegment(path, basePath);

    res[key] = {
      stories: {},
      source,
      title: module.default?.title ?? key
    };

    for (const comp of Object.keys(module)) {
      if (typeof module[comp] === 'function') {
        res[key].stories[comp] = module[comp];
      }
    }
  });

  return res;
}

function convertFileNameToPathSegment(path: string, basePath: string) {
  if (path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }

  if (path.startsWith('/')) {
    path = path.slice(1);
  }

  return path.trim().replace(/[-\.\/]/g, '-');
}
