import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { bookCommand } from './cli/book';
import { buildCommand } from './cli/build';
import { devCommand } from './cli/dev';

yargs(hideBin(process.argv))
  .command(buildCommand)
  .command(devCommand)
  .command(bookCommand)
  .demandCommand()
  .argv
