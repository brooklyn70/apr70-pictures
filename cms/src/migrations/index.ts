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
import * as migration_20260710_v9_content_model from './20260710_v9_content_model';
import * as migration_20260712_171318_v10_brand_kit_founding_roll from './20260712_171318_v10_brand_kit_founding_roll';
import * as migration_20260712_173039_v10_founding_roll_block from './20260712_173039_v10_founding_roll_block';
import * as migration_20260713_213517_troupe_switch from './20260713_213517_troupe_switch';
import * as migration_20260713_222007_division_brand_and_favicons from './20260713_222007_division_brand_and_favicons';
import * as migration_20260713_dispatch_switch from './20260713_dispatch_switch';
import * as migration_20260714_frame_ratio from './20260714_frame_ratio';
import * as migration_20260718_201112_ai_mark from './20260718_201112_ai_mark';
import * as migration_20260718_231500_story_meta from './20260718_231500_story_meta';

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
    name: '20260528_020717_dispatch_schema',
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
  {
    up: migration_20260710_v9_content_model.up,
    down: migration_20260710_v9_content_model.down,
    name: '20260710_v9_content_model',
  },
  {
    up: migration_20260712_171318_v10_brand_kit_founding_roll.up,
    down: migration_20260712_171318_v10_brand_kit_founding_roll.down,
    name: '20260712_171318_v10_brand_kit_founding_roll',
  },
  {
    up: migration_20260712_173039_v10_founding_roll_block.up,
    down: migration_20260712_173039_v10_founding_roll_block.down,
    name: '20260712_173039_v10_founding_roll_block',
  },
  {
    up: migration_20260713_213517_troupe_switch.up,
    down: migration_20260713_213517_troupe_switch.down,
    name: '20260713_213517_troupe_switch',
  },
  {
    up: migration_20260713_222007_division_brand_and_favicons.up,
    down: migration_20260713_222007_division_brand_and_favicons.down,
    name: '20260713_222007_division_brand_and_favicons',
  },
  {
    up: migration_20260713_dispatch_switch.up,
    down: migration_20260713_dispatch_switch.down,
    name: '20260713_dispatch_switch',
  },
  {
    up: migration_20260714_frame_ratio.up,
    down: migration_20260714_frame_ratio.down,
    name: '20260714_frame_ratio',
  },
  {
    up: migration_20260718_201112_ai_mark.up,
    down: migration_20260718_201112_ai_mark.down,
    name: '20260718_201112_ai_mark'
  },
  {
    up: migration_20260718_231500_story_meta.up,
    down: migration_20260718_231500_story_meta.down,
    name: '20260718_231500_story_meta'
  },
];
