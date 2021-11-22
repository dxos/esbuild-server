import chalk from 'chalk';
import { BuildResult, Plugin } from 'esbuild';
import { readFile } from 'fs/promises';
import http from 'http'
import { join } from 'path/posix';

import { Trigger } from './trigger';

export interface ResolvedFile {
  path: string
  contents: Uint8Array
}

export interface DevServerConfig {
  port: number,
  staticDir?: string,
  logRequests?: boolean
}

export class DevServer {
  private buildTrigger = new Trigger<BuildResult>();

  constructor(
    readonly config: DevServerConfig
  ) {}

  createPlugin(): Plugin {
    return {
      name: 'esbuild-server',
      setup: ({ onStart, onEnd }) => {
        let startTime: number = 0;
        onStart(() => {
          console.log(chalk`🏎️  {dim Build started}`)
          startTime = Date.now()

          this.buildTrigger.reset();
        })

        onEnd((result) => {
          if (result.errors.length > 0) {
            console.log(chalk`🚫 {dim Build} {red failed} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`)
            return
          }
          console.log(chalk`🏁 {dim Build} {green finished} {dim in} {white ${((Date.now() - startTime) / 1000).toFixed(2)}} {dim seconds}`)

          this.buildTrigger.wake(result);
        })
      }
    }
  }

  private async resolveFile(url: string): Promise<ResolvedFile | undefined> {
    const buildResult = await this.buildTrigger.wait()

    const output = buildResult.outputFiles?.find(file => file.path === url)
    if (output) {
      return {
        path: output.path,
        contents: output.contents,
      }
    }

    if (this.config.staticDir) {
      try {
        const path = join(this.config.staticDir, url)
        const contents = await readFile(path)

        return {
          path,
          contents,
        }
      } catch {}
    }

    if (url === '/') {
      return this.resolveFile('index.html')
    }

    return undefined
  }

  listen(port: number = this.config.port, callback?: (code: string) => void) {
    const server = http.createServer(async (req, res) => {
      const start = Date.now()

      this.config.logRequests && console.log(`=> ${req.method} ${req.url} ${req.headers['accept']}`)

      const respondWithFile = (file: ResolvedFile) => {
        this.config.logRequests && console.log(`<= 200 ${file.path} (${file.contents.length} bytes) ${Date.now() - start}ms`)

        res.writeHead(200)
        res.write(file?.contents)
        res.end()
      }

      const file = await this.resolveFile(req.url!)
      if (file) {
        respondWithFile(file)
        return
      }

      const indexFile = await this.resolveFile('/')
      if (indexFile) {
        respondWithFile(indexFile)
        return
      }

      this.config.logRequests && console.log(`<= 404`)

      res.writeHead(404, 'Not found')
      res.end()
    })

    server.on('error', (err: any) => {
      callback?.(err.code)
      server.close()
    });

    server.listen(port, () => {
      console.log(chalk`🚀 {dim Listening on} {white http://localhost:${port}}`)
    })

    return server
  }
}
