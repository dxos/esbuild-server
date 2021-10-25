import { FC } from 'react'

export type Stories = Record<string, {
  title: string
  stories: Record<string, FC>
}>

export function extractStories(modules: Record<string, any>, basePath: string): Stories {
  const res: Stories = {}

  for (const file of Object.keys(modules)) {
    const key = convertFileNameToPathSegment(file, basePath)

    const mod = modules[file]
    res[key] = {
      title: mod.default?.title ?? key,
      stories: {}
    }

    for (const comp of Object.keys(mod)) {
      if (typeof mod[comp] === 'function') {
        res[key].stories[comp] = mod[comp]
      }
    }
  }

  return res
}

function convertFileNameToPathSegment(filename: string, basePath: string) {
  if (filename.startsWith(basePath)) {
    filename = filename.slice(basePath.length)
  }

  if (filename.startsWith('/')) {
    filename = filename.slice(1)
  }

  return filename.trim().replace(/[-\.\/]/g, '-');
}
