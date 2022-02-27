//
// Copyright 2022 DXOS.org
//

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { bookCommand, buildCommand, devCommand } from './cli';

void yargs(hideBin(process.argv))
  .command(buildCommand)
  .command(devCommand)
  .command(bookCommand)
  .demandCommand()
  .argv;
