import * as migration_20260513_024245 from './20260513_024245';
import * as migration_20260513_131001 from './20260513_131001';

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
];
