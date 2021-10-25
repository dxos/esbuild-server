import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { bookCommand, buildCommand, devCommand } from './cli';

yargs(hideBin(process.argv))
  .command(buildCommand)
  .command(devCommand)
  .command(bookCommand)
  .demandCommand()
  .argv
