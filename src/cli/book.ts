import assert from 'assert';
import chalk from 'chalk';
import fs from 'fs';
import { build } from 'esbuild';
import { ncp } from 'ncp';
import { dirname, join, resolve } from 'path';
import { sync as findPackageJson } from 'pkg-up';
import { promisify } from 'util';
import { CommandModule } from 'yargs';

import { createBookPlugin, createMdxPlugin, resolveFiles } from '../book';
import { DEFAFULT_CONFIG_FILE, validateConfig } from '../config';
import { startDevBundler } from '../dev-bundler';
import { loadConfig } from '../load-config';
import { mkdir } from 'fs/promises';

interface BookCommandArgv {
  pages: string[]
  stories: string[]
  port: number
  config: string
  verbose: boolean
  build: boolean
}

export const bookCommand: CommandModule<{}, BookCommandArgv> = {
  command: 'book [stories...]',
  describe: 'start the dev server with a book of components',
  builder: yargs => yargs
    .positional('stories', {
      describe: 'glob to find story files',
      type: 'string',
      array: true,
      default: ['./stories/**/*.stories.[jt]sx']
    })
    .positional('pages', {
      describe: 'glob to find story pages',
      type: 'string',
      array: true,
      default: ['./stories/**/*.mdx']
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      default: 8080
    })
    .option('config', {
      type: 'string',
      default: DEFAFULT_CONFIG_FILE
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      default: false
    })
    .option('mdx', {
      type: 'boolean',
      default: false
    })
    .option('mode', {
      type: 'string',
      default: 'dark'
    })
    .option('build', {
      type: 'boolean',
      default: false,
      describe: 'build a static stories site instead of starting a dev-server'
    }),
  handler: async argv => {
    const config = loadConfig(argv.config);
    const overrides = config?.overrides || {};
    if (config) {
      console.log(chalk`🔧 {dim Loaded config from} {white ${argv.config}}`);
    }

    validateConfig(config ?? {});

    const projectRoot = process.cwd();
    const packageRoot = getPackageRoot();
    const staticDir = join(packageRoot, 'src/book/ui/public');
    const outdir = config?.outdir || './dist';

    const readme = join(projectRoot, 'README.md');
    const pages = [
      ...(fs.existsSync(readme) ? [readme] : []),
      ...(argv.mdx ? (await resolveFiles(argv.pages)).map(file => resolve(file)) : [])
    ];

    const stories = (await resolveFiles(argv.stories)).map(file => resolve(file));

    if (pages.length === 0 && stories.length === 0) {
      console.log(chalk`{red error}: No pages or stories found.`);
      process.exit(1);
    }

    console.log(chalk`🔎 {dim Found} {white ${stories.length}} {dim files with stories}`);

    if (argv.verbose) {
      if (pages.length) {
        console.log('Pages:');
        for (const page of pages) {
          console.log(`- ${chalk.green(page)}`);
        }
      }

      if (stories.length) {
        console.log('Stories:');
        for (const file of stories) {
          console.log(`- ${chalk.green(file)}`);
        }
      }
    }

    const defaultPlugins = [
      createBookPlugin(process.cwd(), packageRoot, pages, stories, { mode: argv.mode })
    ];

    if (argv.mdx) {
      defaultPlugins.push(
        await createMdxPlugin({ mdx: Boolean(argv.mdx) })
      );
    }

    if (argv.build) {
      console.log(chalk`🏎️  {dim Build started}`);
      const startTime = Date.now();

      try {
        try {
          await mkdir(outdir, { recursive: true });

          await promisify(ncp)(staticDir, outdir);
        } catch (err) {
          console.error(err);
          throw err;
        }

        await build({
          entryPoints: {
            'index': 'entrypoint'
          },
          outdir,
          bundle: true,
          write: true,
          platform: 'browser',
          format: 'iife',
          plugins: [
            ...defaultPlugins,
            ...(config?.plugins ?? [])
          ],
          sourcemap: true,
          metafile: true,
          loader: {
            '.jpg': 'file',
            '.png': 'file',
            '.svg': 'file'
          },
          ...overrides
        });
        console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
      } catch (err) {
        console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
        process.exit(1);
      }
    } else {
      startDevBundler({
        entryPoints: {
          'index': 'entrypoint'
        },
        plugins: [
          ...defaultPlugins,
          ...(config?.plugins ?? [])
        ],
        devServer: {
          port: argv.port,
          staticDir,
          logRequests: argv.verbose
        },
        overrides
      });
    }
  }
};

function getPackageRoot() {
  const pkg = findPackageJson({ cwd: __dirname });
  assert(pkg);
  return dirname(pkg);
}
