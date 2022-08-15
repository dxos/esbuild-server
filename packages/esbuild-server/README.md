# ESBuild Server

A fast dev-server and storybook built with esbuild.

[![CI](https://github.com/dxos/esbuild-server/actions/workflows/ci.yaml/badge.svg)](https://github.com/dxos/esbuild-server/actions/workflows/ci.yaml)
<img src="https://img.shields.io/npm/v/@dxos/esbuild-server"/>


### Usage

Run `esbuild-server --help` or `esbuild-server <command> --help` to list all commands.

```bash
esbuild-server <command>

Commands:
  esbuild-server build              Build the app for production.
  esbuild-server server             Start the dev server.
  esbuild-server book [stories...]  Start the dev server with a book of components.

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

## Server

Specify and entry-point to serve an application:

```bash
esbuild-server server
```

To run the server with TLS support:

```bash
esbuild-server server --https
```

Initially this requires root permissions to create the dev TLC certificate.

## Storybook

Stories are compatible with the Storybooks:

```bash
esbuild-server book
```

Each story file should export a set of components and optionally a default export with the title that will be displayed in the outline.

To build static books:

```bash
esbuild-server book --build
```

## Config file

The config is automatically loaded from `./esbuild-server.config.js`.

```typescript
export interface Config {
  /**
   * List of entry points to bundle.
   * Those are then can be requested from the dev server.
   *
   * Read more: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: string[] | Record<string, string>

  /**
   * Directory to output production build to.
   */
  outdir?: string

  /**
   * Override esapp default settings for esbuild
   */
  overrides?: BuildOptions

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

## Publishing

```bash
yarn publish --patch
```

## Polyfills

Currently `esbuild-server` does not polyfill any of the node.js modules or globals. 
If your code is using them you need to manually include a plugin to add them.
