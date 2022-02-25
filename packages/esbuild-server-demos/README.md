# Examples

To run the dev server with the examples build the package (optionally in watch mode).

```bash
yarn build --watch
```

## App Server

To run the app server.

```bash
cd ../esbuild-server-demos/
rushx dev
```

## Book

To run the storybook:

```bash
cd ../esbuild-server-demos/
rushx book
```

To run the storybook with MDX pages generation:

```bash
cd ../esbuild-server-demos/
rushx book --mdx
```

To build the storybook:

```bash
cd ../esbuild-server-demos/
rushx book --build
```
