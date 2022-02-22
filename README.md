# ESBuild Server

A fast dev-server and storybook built with esbuild.

[![CI](https://github.com/dxos/esbuild-server/actions/workflows/ci.yaml/badge.svg)](https://github.com/dxos/esbuild-server/actions/workflows/ci.yaml)
<img src="https://img.shields.io/npm/v/@dxos/esbuild-server"/>

## Installation

Install or update rush and its dependencies:

```bash
npm install -g @microsoft/rush pnpm
```

## Rush monorepo

1. The project currently uses private NPM packages.
   Make sure you have access to the [`dxos`](https://www.npmjs.com/org/dxos) NPM org
   and that you are logged in to NPM (check via `npm whoami`, otherwise `npm login`).

2. To install dependencies:

```
rush update
```

3. To build packages:

```
rush build
```

### Local Development

- Re-run `rush update` after changing any `package.json` files.
- Run `rushx build` in a local package folder to get local errors.

### Adding new dependencies

```
cd package/directory
rush add [--dev] -p <package name> --make-consistent
```

### Running scripts in individual packages

```
cd package/directory
rushx <script name>
```