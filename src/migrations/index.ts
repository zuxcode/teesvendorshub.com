import * as migration_20260930_034904 from './20260930_034904';
import * as migration_20260930_035054 from './20260930_035054';

export const migrations = [
  {
    up: migration_20260930_034904.up,
    down: migration_20260930_034904.down,
    name: '20260930_034904',
  },
  {
    up: migration_20260930_035054.up,
    down: migration_20260930_035054.down,
    name: '20260930_035054'
  },
];
