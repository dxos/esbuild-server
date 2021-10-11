# ESApp - amazingly fast dev-server built with esbuild

<img src="https://img.shields.io/npm/v/esapp"/>

## Getting started

Look in the `src/example` directory.

## CLI reference

```
esapp <command>

Commands:
  esapp dev                start the dev server
  esapp book <stories...>  start the dev server with a book of components

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number  
```

## Config file

Config is automatically loaded from `./esapp.config.js`.

```typescript
export interface Config {
  /**
   * List of entry points to bundle.
   * 
   * Those are then can be requested from the dev server.
   * 
   * Read more: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: string[] | Record<string, string>

  /**
   * Directory with static files to be served by the dev server.
   */
  staticDir?: string

  /**
   * Esbuild plugins: https://esbuild.github.io/plugins/.
   */
  plugins?: Plugin[]
}
```

## Storybook

ESApp's stories are compatible with storybook format, although only the very minimal features are supported.

To render a storybook run `esapp book 'stories/**/*.stories.tsx'` (replacing with your glob for stories).

Each story file should export a set of components and optionally a default export with the title that will be displayed in the outline.

## Polyfills

Currently ESApp does not polyfill any of the node.js modules or globals. If your code is using them you'd need to manually include a plugin to add them.
