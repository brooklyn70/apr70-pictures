import * as migration_20260513_024245 from './20260513_024245';
import * as migration_20260513_131001 from './20260513_131001';
import * as migration_20260513_185804 from './20260513_185804';
import * as migration_20260513_194834 from './20260513_194834';

export const migrations = [
  {
    up: migration_20260513_024245.up,
    down: migration_20260513_024245.down,
    name: '20260513_024245',
  },
  {
    up: migration_20260513_131001.up,
    down: migration_20260513_131001.down,
    name: '20260513_131001',
  },
  {
    up: migration_20260513_185804.up,
    down: migration_20260513_185804.down,
    name: '20260513_185804',
  },
  {
    up: migration_20260513_194834.up,
    down: migration_20260513_194834.down,
    name: '20260513_194834',
  },
];
