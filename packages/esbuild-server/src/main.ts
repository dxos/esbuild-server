//
// Copyright 2022 DXOS.org
//

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { bookCommand, buildCommand, serverCommand } from './cli';

void yargs(hideBin(process.argv))
  .command(bookCommand)
  .command(buildCommand)
  .command(serverCommand)
  .demandCommand()
  .argv;
