import * as migration_20260513_024245 from './20260513_024245';
import * as migration_20260513_131001 from './20260513_131001';
import * as migration_20260513_185804 from './20260513_185804';
import * as migration_20260513_194834 from './20260513_194834';
import * as migration_20260515_201608_brand_fields from './20260515_201608_brand_fields';
import * as migration_20260528_020717_dispatch_schema from './20260528_020717_dispatch_schema';
import * as migration_20260625_division_theme from './20260625_division_theme';
import * as migration_20260705_troupe_page from './20260705_troupe_page';
import * as migration_20260705_v4_zine_blocks from './20260705_v4_zine_blocks';
import * as migration_20260708_property_page_fields from './20260708_property_page_fields';

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
  {
    up: migration_20260515_201608_brand_fields.up,
    down: migration_20260515_201608_brand_fields.down,
    name: '20260515_201608_brand_fields',
  },
  {
    up: migration_20260528_020717_dispatch_schema.up,
    down: migration_20260528_020717_dispatch_schema.down,
    name: '20260528_020717_dispatch_schema'
  },
  {
    up: migration_20260625_division_theme.up,
    down: migration_20260625_division_theme.down,
    name: '20260625_division_theme',
  },
  {
    up: migration_20260705_troupe_page.up,
    down: migration_20260705_troupe_page.down,
    name: '20260705_troupe_page',
  },
  {
    up: migration_20260705_v4_zine_blocks.up,
    down: migration_20260705_v4_zine_blocks.down,
    name: '20260705_v4_zine_blocks',
  },
  {
    up: migration_20260708_property_page_fields.up,
    down: migration_20260708_property_page_fields.down,
    name: '20260708_property_page_fields',
  },
];
