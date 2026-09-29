import * as migration_20260922_104531 from './20260922_104531';
import * as migration_20260927_183606 from './20260927_183606';
import * as migration_20260927_201219 from './20260927_201219';

export const migrations = [
  {
    up: migration_20260922_104531.up,
    down: migration_20260922_104531.down,
    name: '20260922_104531',
  },
  {
    up: migration_20260927_183606.up,
    down: migration_20260927_183606.down,
    name: '20260927_183606',
  },
  {
    up: migration_20260927_201219.up,
    down: migration_20260927_201219.down,
    name: '20260927_201219'
  },
];
