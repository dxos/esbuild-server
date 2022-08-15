//
// Copyright 2022 DXOS.org
//

import chalk from 'chalk';
import { BuildResult, Plugin } from 'esbuild';
import { readFile } from 'fs/promises';
import http, { ServerResponse } from 'http';
import https from 'https';
import { isAbsolute } from 'path';
import { join } from 'path/posix';

import { Trigger } from '../util';

export const UPDATE_EVENTS = '/events';

export interface ResolvedFile {
  path: string
  contents: Uint8Array
}

export interface DevServerConfig {
  port: number
  staticDir?: string
  logRequests?: boolean
}

export interface DevServerOptions {
  port: number
  tls?: {
    cert?: string
    key?: string
  }
}

/**
 * HTTP server dynamically serves build assets.
 */
export class DevServer {
  private readonly buildTrigger = new Trigger<BuildResult>();
  private clients: ServerResponse[] = [];

  constructor (
    readonly config: DevServerConfig
  ) {}

  createPlugin (): Plugin {
    return {
      name: 'esbuild-server',
      setup: ({ onStart, onEnd }) => {
        let startTime = 0;
        onStart(() => {
          console.log(chalk`🏎️ {dim Build started}`);
          startTime = Date.now();
          this.buildTrigger.reset();
        });

        onEnd((result) => {
          if (result.errors.length > 0) {
            console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
            return;
          }

          console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`);
          this.buildTrigger.wake(result);
        });
      }
    };
  }

  private async resolveFile (url: string): Promise<ResolvedFile | undefined> {
    const buildResult = await this.buildTrigger.wait();
    const output = buildResult.outputFiles?.find(file => file.path === url);
    if (output) {
      return {
        path: output.path,
        contents: output.contents
      };
    }

    if (isAbsolute(url)) {
      try {
        const contents = await readFile(url);
        return {
          path: url,
          contents
        };
      } catch {}
    }

    if (this.config.staticDir) {
      try {
        const path = join(this.config.staticDir, url);
        const contents = await readFile(path);
        return {
          path,
          contents
        };
      } catch {}
    }

    if (url === '/') {
      return this.resolveFile('index.html');
    }

    return undefined;
  }

  async listen (
    options: DevServerOptions = { port: this.config.port },
    callback?: (code: string) => void
  ) {
    const scheme = options.tls ? 'https' : 'http';
    const factory = scheme === 'https' ? https : http;

    // https://nodejs.org/api/https.html
    const server = factory.createServer(options.tls ?? {}, async (req, res) => {
      const start = Date.now();

      this.config.logRequests && console.log(`=> ${req.method} ${req.url} ${req.headers.accept}`);

      const respondWithFile = (file: ResolvedFile) => {
        this.config.logRequests && console.log(`<= 200 ${file.path} (${file.contents.length} bytes) ${Date.now() - start}ms`);

        if (req.url === UPDATE_EVENTS) {
          // Maintain set of clients to push rebuild updates.
          const response = res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
          });

          this.clients.push(response);
          // NOTE: Don't call res.end().
        } else {
          res.writeHead(200, Object.assign({}, req.url?.endsWith('.js') ? {
            'Content-Type': 'application/javascript'
          } : undefined));
          res.write(file?.contents);
          res.end();
        }
      };

      const file = await this.resolveFile(req.url!);
      if (file) {
        respondWithFile(file);
        return;
      }

      const indexFile = await this.resolveFile('/');
      if (indexFile) {
        respondWithFile(indexFile);
        return;
      }

      this.config.logRequests && console.log('<= 404');
      res.writeHead(404, 'Not found');
      res.end();
    });

    server.on('error', (err: any) => {
      callback?.(err.code);
      server.close();
    });

    server.listen(options.port, () => {
      console.log(chalk`🚀 {dim Listening on} {white ${scheme}://localhost:${options.port}}`);
    });

    return server;
  }

  update () {
    this.config.logRequests && console.log('Updating clients:', this.clients.length);
    this.clients.forEach(res => res.write('data: update\n\n'));
    this.clients = [];
  }
}
