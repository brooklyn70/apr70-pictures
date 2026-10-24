import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. schema: locale companion tables, the stored AI Mark flag, enabledLocales.
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'pt', 'it', 'fr', 'de');
  CREATE TYPE "public"."enum_site_settings_enabled_locales" AS ENUM('en', 'pt', 'it', 'fr', 'de');
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_gallery_locales" (
  	"caption" varchar,
  	"credit" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_blocks_zine_synopsis_locales" (
  	"kicker" varchar,
  	"logline" varchar,
  	"body" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"subtitle" varchar,
  	"story_place" varchar,
  	"logline" varchar,
  	"short_logline" varchar,
  	"provenance" varchar,
  	"meta_line" varchar,
  	"body_prose" varchar,
  	"page_quote_quote" varchar,
  	"page_quote_cite" varchar,
  	"page_quote_note" varchar,
  	"hero_line" varchar,
  	"hero_caption" varchar,
  	"hero_credit" varchar,
  	"request_body" varchar,
  	"synopsis" varchar,
  	"pitch_deck_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar NOT NULL,
  	"deck" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_cover_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_cover_coverlines_locales" (
  	"head" varchar,
  	"deck" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_contents_entries_locales" (
  	"title" varchar NOT NULL,
  	"deck" varchar,
  	"by" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_contents_locales" (
  	"label" varchar NOT NULL,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_editorial_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_title_parts_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_meta_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_paragraphs_locales" (
  	"text" varchar NOT NULL,
  	"attr" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_factbox_fields_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_feature_related_locales" (
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_dispatches_locales" (
  	"date" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"status" varchar,
  	"ghost" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_trades_locales" (
  	"city" varchar,
  	"headline" varchar NOT NULL,
  	"deck" varchar,
  	"attr" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_calendar_locales" (
  	"date" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"sub" varchar,
  	"tag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_classifieds_locales" (
  	"cat" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_archive_locales" (
  	"season" varchar,
  	"line" varchar,
  	"state" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "dispatch_issues_locales" (
  	"display_title" varchar NOT NULL,
  	"indicia_season" varchar DEFAULT 'SPRING 2026' NOT NULL,
  	"indicia_print_run" varchar DEFAULT 'PRESSRUN 1,200',
  	"indicia_offices" varchar DEFAULT 'LIC NY 11101',
  	"indicia_tagline" varchar DEFAULT 'PRECISE. PURPOSEFUL. BUILT TO LAST.',
  	"cover_kicker" varchar,
  	"cover_deck" varchar,
  	"cover_byline" varchar,
  	"editorial_eyebrow" varchar,
  	"editorial_title" varchar,
  	"editorial_lead" varchar,
  	"editorial_signature_name" varchar,
  	"editorial_signature_meta" varchar,
  	"editorial_quote" varchar,
  	"feature_eyebrow" varchar,
  	"feature_deck" varchar,
  	"feature_image_caption_caption" varchar,
  	"feature_image_caption_credit" varchar,
  	"feature_factbox_label" varchar DEFAULT 'AT A GLANCE',
  	"colophon_legal" varchar,
  	"colophon_type" varchar,
  	"colophon_baseline" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_zine_masthead_locales" (
  	"offices_line" varchar,
  	"issue_label" varchar,
  	"dek" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_zine_passage_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_zine_passage_locales" (
  	"kicker" varchar,
  	"heading" varchar NOT NULL,
  	"lede" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_enabled_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_enabled_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_v9_chrome_nav_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"ai_mark_text" varchar DEFAULT 'APR 70 · AI GEN',
  	"v9_chrome_display_label" varchar,
  	"v9_chrome_panel_title" varchar,
  	"v9_chrome_theme_label" varchar,
  	"v9_chrome_theme_premiere" varchar,
  	"v9_chrome_theme_matinee" varchar,
  	"v9_chrome_theme_lateshow" varchar,
  	"v9_chrome_scale_label" varchar,
  	"v9_chrome_logo_label" varchar,
  	"v9_chrome_top_label" varchar,
  	"v9_chrome_prev_label" varchar,
  	"v9_chrome_next_label" varchar,
  	"v9_chrome_slate_return" varchar,
  	"v9_chrome_cta" varchar,
  	"v9_chrome_colophon" varchar,
  	"v9_chrome_copyright" varchar,
  	"dispatch_nav_label" varchar DEFAULT 'Dispatch',
  	"troupe_nav_label" varchar DEFAULT 'Troupe',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_links_primary_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_links_division_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_links_more_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "jobs_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pitch_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "investors_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_zine_passage_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "212_blocks_zine_passage_locales" (
  	"kicker" varchar,
  	"heading" varchar NOT NULL,
  	"lede" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_zine_passage_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "310_blocks_zine_passage_locales" (
  	"kicker" varchar,
  	"heading" varchar NOT NULL,
  	"lede" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_grid_items_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_grid_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_filmstrip_tiles_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_division_showcase_divisions_locales" (
  	"subtitle" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_division_showcase_locales" (
  	"heading" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_zine_passage_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "nrc_blocks_zine_passage_locales" (
  	"kicker" varchar,
  	"heading" varchar NOT NULL,
  	"lede" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_hero_slider_items_locales" (
  	"title" varchar,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_hero_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_playbill_voices_locales" (
  	"voice" varchar NOT NULL,
  	"descriptor" varchar,
  	"roles" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_playbill_locales" (
  	"program_number" varchar,
  	"subtitle" varchar,
  	"runtime" varchar,
  	"notes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_rich_text_locales" (
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_two_col_locales" (
  	"left_heading" varchar NOT NULL,
  	"right_body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_cta_buttons_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_cta_locales" (
  	"heading" varchar NOT NULL,
  	"subtext" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_quotes_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_quotes_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_stats_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_blocks_divider_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_program_cast_locales" (
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "troupe_program_locales" (
  	"subtitle" varchar,
  	"logline" varchar,
  	"programme_note" varchar,
  	"credits" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_photo_fold_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_route_line_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_text_fold_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"cite" varchar,
  	"more_label" varchar,
  	"link_label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_quote_feature_locales" (
  	"quote" varchar,
  	"cite" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_slate_list_rows_locales" (
  	"logline" varchar,
  	"provenance" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_footnote_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_request_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_ledger_rows_locales" (
  	"term" varchar,
  	"definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_ledger_locales" (
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_archival_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_division_strip_divisions_locales" (
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_mood_grid_items_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_mood_grid_locales" (
  	"aria_label" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_blocks_founding_roll_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"success_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_home_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_photo_fold_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_route_line_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_text_fold_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"cite" varchar,
  	"more_label" varchar,
  	"link_label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_quote_feature_locales" (
  	"quote" varchar,
  	"cite" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_slate_list_rows_locales" (
  	"logline" varchar,
  	"provenance" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_footnote_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_request_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_ledger_rows_locales" (
  	"term" varchar,
  	"definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_ledger_locales" (
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_archival_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_division_strip_divisions_locales" (
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_mood_grid_items_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_mood_grid_locales" (
  	"aria_label" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_blocks_founding_roll_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"success_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_slate_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_photo_fold_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_route_line_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_text_fold_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"cite" varchar,
  	"more_label" varchar,
  	"link_label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_quote_feature_locales" (
  	"quote" varchar,
  	"cite" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_slate_list_rows_locales" (
  	"logline" varchar,
  	"provenance" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_footnote_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_request_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_ledger_rows_locales" (
  	"term" varchar,
  	"definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_ledger_locales" (
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_archival_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_division_strip_divisions_locales" (
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_mood_grid_items_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_mood_grid_locales" (
  	"aria_label" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_blocks_founding_roll_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"success_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_craft_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_photo_fold_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_route_line_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_text_fold_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"cite" varchar,
  	"more_label" varchar,
  	"link_label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_quote_feature_locales" (
  	"quote" varchar,
  	"cite" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_slate_list_rows_locales" (
  	"logline" varchar,
  	"provenance" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_footnote_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_request_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_ledger_rows_locales" (
  	"term" varchar,
  	"definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_ledger_locales" (
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_archival_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_division_strip_divisions_locales" (
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_mood_grid_items_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_mood_grid_locales" (
  	"aria_label" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_blocks_founding_roll_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"success_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_methods_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_photo_fold_locales" (
  	"kicker" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_route_line_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_text_fold_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"lede" varchar,
  	"body" varchar,
  	"quote" varchar,
  	"cite" varchar,
  	"more_label" varchar,
  	"link_label" varchar,
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_quote_feature_locales" (
  	"quote" varchar,
  	"cite" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_slate_list_rows_locales" (
  	"logline" varchar,
  	"provenance" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_footnote_locales" (
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_request_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_ledger_rows_locales" (
  	"term" varchar,
  	"definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_ledger_locales" (
  	"aria_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_archival_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_division_strip_divisions_locales" (
  	"blurb" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_mood_grid_items_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_mood_grid_locales" (
  	"aria_label" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_blocks_founding_roll_locales" (
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"success_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "v9_contact_locales" (
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "media" ADD COLUMN "ai_frame" boolean DEFAULT false;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery_locales" ADD CONSTRAINT "projects_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero_slider_items_locales" ADD CONSTRAINT "projects_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_hero_locales" ADD CONSTRAINT "projects_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_rich_text_locales" ADD CONSTRAINT "projects_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_two_col_locales" ADD CONSTRAINT "projects_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_grid_items_locales" ADD CONSTRAINT "projects_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_grid_locales" ADD CONSTRAINT "projects_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_cta_buttons_locales" ADD CONSTRAINT "projects_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_cta_locales" ADD CONSTRAINT "projects_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quotes_quotes_locales" ADD CONSTRAINT "projects_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quotes_locales" ADD CONSTRAINT "projects_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "projects_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "projects_blocks_division_showcase_divisions_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_division_showcase_locales" ADD CONSTRAINT "projects_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_stats_stats_locales" ADD CONSTRAINT "projects_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_stats_locales" ADD CONSTRAINT "projects_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_divider_locales" ADD CONSTRAINT "projects_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_zine_synopsis_locales" ADD CONSTRAINT "projects_blocks_zine_synopsis_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_zine_synopsis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_hero_slider_items_locales" ADD CONSTRAINT "news_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_hero_locales" ADD CONSTRAINT "news_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_rich_text_locales" ADD CONSTRAINT "news_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_two_col_locales" ADD CONSTRAINT "news_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_grid_items_locales" ADD CONSTRAINT "news_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_grid_locales" ADD CONSTRAINT "news_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_cta_buttons_locales" ADD CONSTRAINT "news_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_cta_locales" ADD CONSTRAINT "news_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_quotes_quotes_locales" ADD CONSTRAINT "news_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_quotes_locales" ADD CONSTRAINT "news_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "news_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "news_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_division_showcase_locales" ADD CONSTRAINT "news_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_stats_stats_locales" ADD CONSTRAINT "news_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_stats_locales" ADD CONSTRAINT "news_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_blocks_divider_locales" ADD CONSTRAINT "news_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_cover_lines_locales" ADD CONSTRAINT "dispatch_issues_cover_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_cover_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_cover_coverlines_locales" ADD CONSTRAINT "dispatch_issues_cover_coverlines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_cover_coverlines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_contents_entries_locales" ADD CONSTRAINT "dispatch_issues_contents_entries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_contents_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_contents_locales" ADD CONSTRAINT "dispatch_issues_contents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_editorial_paragraphs_locales" ADD CONSTRAINT "dispatch_issues_editorial_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_editorial_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_title_parts_locales" ADD CONSTRAINT "dispatch_issues_feature_title_parts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_feature_title_parts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_meta_locales" ADD CONSTRAINT "dispatch_issues_feature_meta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_feature_meta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_paragraphs_locales" ADD CONSTRAINT "dispatch_issues_feature_paragraphs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_feature_paragraphs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_factbox_fields_locales" ADD CONSTRAINT "dispatch_issues_feature_factbox_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_feature_factbox_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_feature_related_locales" ADD CONSTRAINT "dispatch_issues_feature_related_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_feature_related"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_dispatches_locales" ADD CONSTRAINT "dispatch_issues_dispatches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_dispatches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_trades_locales" ADD CONSTRAINT "dispatch_issues_trades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_trades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_calendar_locales" ADD CONSTRAINT "dispatch_issues_calendar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_calendar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_classifieds_locales" ADD CONSTRAINT "dispatch_issues_classifieds_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_classifieds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_archive_locales" ADD CONSTRAINT "dispatch_issues_archive_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dispatch_issues_locales" ADD CONSTRAINT "dispatch_issues_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dispatch_issues"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_items_locales" ADD CONSTRAINT "home_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_locales" ADD CONSTRAINT "home_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_rich_text_locales" ADD CONSTRAINT "home_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_two_col_locales" ADD CONSTRAINT "home_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_grid_items_locales" ADD CONSTRAINT "home_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_grid_locales" ADD CONSTRAINT "home_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_buttons_locales" ADD CONSTRAINT "home_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_cta_locales" ADD CONSTRAINT "home_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quotes_quotes_locales" ADD CONSTRAINT "home_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quotes_locales" ADD CONSTRAINT "home_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "home_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "home_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_division_showcase_locales" ADD CONSTRAINT "home_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats_stats_locales" ADD CONSTRAINT "home_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_stats_locales" ADD CONSTRAINT "home_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_divider_locales" ADD CONSTRAINT "home_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_zine_masthead_locales" ADD CONSTRAINT "home_blocks_zine_masthead_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_zine_masthead"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_zine_passage_links_locales" ADD CONSTRAINT "home_blocks_zine_passage_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_zine_passage_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_zine_passage_locales" ADD CONSTRAINT "home_blocks_zine_passage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_enabled_locales" ADD CONSTRAINT "site_settings_enabled_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_v9_chrome_nav_links_locales" ADD CONSTRAINT "site_settings_v9_chrome_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_v9_chrome_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_primary_nav_locales" ADD CONSTRAINT "footer_links_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_division_nav_locales" ADD CONSTRAINT "footer_links_division_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links_division_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_more_nav_locales" ADD CONSTRAINT "footer_links_more_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links_more_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_hero_slider_items_locales" ADD CONSTRAINT "about_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_hero_locales" ADD CONSTRAINT "about_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_rich_text_locales" ADD CONSTRAINT "about_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_two_col_locales" ADD CONSTRAINT "about_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_grid_items_locales" ADD CONSTRAINT "about_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_grid_locales" ADD CONSTRAINT "about_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_cta_buttons_locales" ADD CONSTRAINT "about_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_cta_locales" ADD CONSTRAINT "about_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_quotes_quotes_locales" ADD CONSTRAINT "about_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_quotes_locales" ADD CONSTRAINT "about_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "about_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "about_blocks_division_showcase_divisions_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_division_showcase_locales" ADD CONSTRAINT "about_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_stats_stats_locales" ADD CONSTRAINT "about_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_stats_locales" ADD CONSTRAINT "about_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_blocks_divider_locales" ADD CONSTRAINT "about_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero_slider_items_locales" ADD CONSTRAINT "contact_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_hero_locales" ADD CONSTRAINT "contact_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_rich_text_locales" ADD CONSTRAINT "contact_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_two_col_locales" ADD CONSTRAINT "contact_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_grid_items_locales" ADD CONSTRAINT "contact_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_grid_locales" ADD CONSTRAINT "contact_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_cta_buttons_locales" ADD CONSTRAINT "contact_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_cta_locales" ADD CONSTRAINT "contact_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_quotes_quotes_locales" ADD CONSTRAINT "contact_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_quotes_locales" ADD CONSTRAINT "contact_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "contact_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "contact_blocks_division_showcase_divisions_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_division_showcase_locales" ADD CONSTRAINT "contact_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_stats_stats_locales" ADD CONSTRAINT "contact_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_stats_locales" ADD CONSTRAINT "contact_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_blocks_divider_locales" ADD CONSTRAINT "contact_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero_slider_items_locales" ADD CONSTRAINT "jobs_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_hero_locales" ADD CONSTRAINT "jobs_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_rich_text_locales" ADD CONSTRAINT "jobs_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_two_col_locales" ADD CONSTRAINT "jobs_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_grid_items_locales" ADD CONSTRAINT "jobs_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_grid_locales" ADD CONSTRAINT "jobs_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_cta_buttons_locales" ADD CONSTRAINT "jobs_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_cta_locales" ADD CONSTRAINT "jobs_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_quotes_quotes_locales" ADD CONSTRAINT "jobs_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_quotes_locales" ADD CONSTRAINT "jobs_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "jobs_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "jobs_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_division_showcase_locales" ADD CONSTRAINT "jobs_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_stats_stats_locales" ADD CONSTRAINT "jobs_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_stats_locales" ADD CONSTRAINT "jobs_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_blocks_divider_locales" ADD CONSTRAINT "jobs_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero_slider_items_locales" ADD CONSTRAINT "pitch_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_hero_locales" ADD CONSTRAINT "pitch_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_rich_text_locales" ADD CONSTRAINT "pitch_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_two_col_locales" ADD CONSTRAINT "pitch_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_grid_items_locales" ADD CONSTRAINT "pitch_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_grid_locales" ADD CONSTRAINT "pitch_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_cta_buttons_locales" ADD CONSTRAINT "pitch_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_cta_locales" ADD CONSTRAINT "pitch_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_quotes_quotes_locales" ADD CONSTRAINT "pitch_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_quotes_locales" ADD CONSTRAINT "pitch_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "pitch_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "pitch_blocks_division_showcase_divisions_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_division_showcase_locales" ADD CONSTRAINT "pitch_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_stats_stats_locales" ADD CONSTRAINT "pitch_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_stats_locales" ADD CONSTRAINT "pitch_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pitch_blocks_divider_locales" ADD CONSTRAINT "pitch_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pitch_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero_slider_items_locales" ADD CONSTRAINT "investors_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_hero_locales" ADD CONSTRAINT "investors_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_rich_text_locales" ADD CONSTRAINT "investors_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_two_col_locales" ADD CONSTRAINT "investors_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_grid_items_locales" ADD CONSTRAINT "investors_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_grid_locales" ADD CONSTRAINT "investors_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_cta_buttons_locales" ADD CONSTRAINT "investors_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_cta_locales" ADD CONSTRAINT "investors_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_quotes_quotes_locales" ADD CONSTRAINT "investors_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_quotes_locales" ADD CONSTRAINT "investors_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "investors_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "investors_blocks_division_showcase_divisions_locales_pare_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_division_showcase_locales" ADD CONSTRAINT "investors_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_stats_stats_locales" ADD CONSTRAINT "investors_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_stats_locales" ADD CONSTRAINT "investors_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "investors_blocks_divider_locales" ADD CONSTRAINT "investors_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."investors_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_hero_slider_items_locales" ADD CONSTRAINT "212_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_hero_locales" ADD CONSTRAINT "212_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_rich_text_locales" ADD CONSTRAINT "212_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_two_col_locales" ADD CONSTRAINT "212_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_grid_items_locales" ADD CONSTRAINT "212_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_grid_locales" ADD CONSTRAINT "212_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_cta_buttons_locales" ADD CONSTRAINT "212_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_cta_locales" ADD CONSTRAINT "212_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_quotes_quotes_locales" ADD CONSTRAINT "212_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_quotes_locales" ADD CONSTRAINT "212_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "212_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "212_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_division_showcase_locales" ADD CONSTRAINT "212_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_stats_stats_locales" ADD CONSTRAINT "212_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_stats_locales" ADD CONSTRAINT "212_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_divider_locales" ADD CONSTRAINT "212_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_zine_passage_links_locales" ADD CONSTRAINT "212_blocks_zine_passage_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_zine_passage_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "212_blocks_zine_passage_locales" ADD CONSTRAINT "212_blocks_zine_passage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."212_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_hero_slider_items_locales" ADD CONSTRAINT "310_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_hero_locales" ADD CONSTRAINT "310_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_rich_text_locales" ADD CONSTRAINT "310_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_two_col_locales" ADD CONSTRAINT "310_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_grid_items_locales" ADD CONSTRAINT "310_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_grid_locales" ADD CONSTRAINT "310_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_cta_buttons_locales" ADD CONSTRAINT "310_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_cta_locales" ADD CONSTRAINT "310_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_quotes_quotes_locales" ADD CONSTRAINT "310_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_quotes_locales" ADD CONSTRAINT "310_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "310_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "310_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_division_showcase_locales" ADD CONSTRAINT "310_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_stats_stats_locales" ADD CONSTRAINT "310_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_stats_locales" ADD CONSTRAINT "310_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_divider_locales" ADD CONSTRAINT "310_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_zine_passage_links_locales" ADD CONSTRAINT "310_blocks_zine_passage_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_zine_passage_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "310_blocks_zine_passage_locales" ADD CONSTRAINT "310_blocks_zine_passage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."310_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero_slider_items_locales" ADD CONSTRAINT "nrc_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_hero_locales" ADD CONSTRAINT "nrc_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_rich_text_locales" ADD CONSTRAINT "nrc_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_two_col_locales" ADD CONSTRAINT "nrc_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_grid_items_locales" ADD CONSTRAINT "nrc_blocks_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_grid_locales" ADD CONSTRAINT "nrc_blocks_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_cta_buttons_locales" ADD CONSTRAINT "nrc_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_cta_locales" ADD CONSTRAINT "nrc_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_quotes_quotes_locales" ADD CONSTRAINT "nrc_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_quotes_locales" ADD CONSTRAINT "nrc_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_filmstrip_tiles_locales" ADD CONSTRAINT "nrc_blocks_filmstrip_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_filmstrip_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_division_showcase_divisions_locales" ADD CONSTRAINT "nrc_blocks_division_showcase_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_division_showcase_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_division_showcase_locales" ADD CONSTRAINT "nrc_blocks_division_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_division_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_stats_stats_locales" ADD CONSTRAINT "nrc_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_stats_locales" ADD CONSTRAINT "nrc_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_divider_locales" ADD CONSTRAINT "nrc_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_zine_passage_links_locales" ADD CONSTRAINT "nrc_blocks_zine_passage_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_zine_passage_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "nrc_blocks_zine_passage_locales" ADD CONSTRAINT "nrc_blocks_zine_passage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."nrc_blocks_zine_passage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero_slider_items_locales" ADD CONSTRAINT "troupe_blocks_hero_slider_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_hero_slider_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_hero_locales" ADD CONSTRAINT "troupe_blocks_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_playbill_voices_locales" ADD CONSTRAINT "troupe_blocks_playbill_voices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_playbill_voices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_playbill_locales" ADD CONSTRAINT "troupe_blocks_playbill_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_playbill"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_rich_text_locales" ADD CONSTRAINT "troupe_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_two_col_locales" ADD CONSTRAINT "troupe_blocks_two_col_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_two_col"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_cta_buttons_locales" ADD CONSTRAINT "troupe_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_cta_locales" ADD CONSTRAINT "troupe_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_quotes_quotes_locales" ADD CONSTRAINT "troupe_blocks_quotes_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_quotes_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_quotes_locales" ADD CONSTRAINT "troupe_blocks_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_stats_stats_locales" ADD CONSTRAINT "troupe_blocks_stats_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_stats_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_stats_locales" ADD CONSTRAINT "troupe_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_blocks_divider_locales" ADD CONSTRAINT "troupe_blocks_divider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_blocks_divider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_program_cast_locales" ADD CONSTRAINT "troupe_program_cast_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_program_cast"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "troupe_program_locales" ADD CONSTRAINT "troupe_program_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."troupe_program"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_photo_fold_locales" ADD CONSTRAINT "v9_home_blocks_photo_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_photo_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_route_line_links_locales" ADD CONSTRAINT "v9_home_blocks_route_line_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_route_line_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_text_fold_locales" ADD CONSTRAINT "v9_home_blocks_text_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_text_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_quote_feature_locales" ADD CONSTRAINT "v9_home_blocks_quote_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_quote_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_slate_list_rows_locales" ADD CONSTRAINT "v9_home_blocks_slate_list_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_slate_list_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_footnote_locales" ADD CONSTRAINT "v9_home_blocks_footnote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_footnote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_request_locales" ADD CONSTRAINT "v9_home_blocks_request_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_request"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_ledger_rows_locales" ADD CONSTRAINT "v9_home_blocks_ledger_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_ledger_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_ledger_locales" ADD CONSTRAINT "v9_home_blocks_ledger_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_archival_locales" ADD CONSTRAINT "v9_home_blocks_archival_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_archival"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_division_strip_divisions_locales" ADD CONSTRAINT "v9_home_blocks_division_strip_divisions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_division_strip_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_mood_grid_items_locales" ADD CONSTRAINT "v9_home_blocks_mood_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_mood_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_mood_grid_locales" ADD CONSTRAINT "v9_home_blocks_mood_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_mood_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_blocks_founding_roll_locales" ADD CONSTRAINT "v9_home_blocks_founding_roll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home_blocks_founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_home_locales" ADD CONSTRAINT "v9_home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_photo_fold_locales" ADD CONSTRAINT "v9_slate_blocks_photo_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_photo_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_route_line_links_locales" ADD CONSTRAINT "v9_slate_blocks_route_line_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_route_line_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_text_fold_locales" ADD CONSTRAINT "v9_slate_blocks_text_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_text_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_quote_feature_locales" ADD CONSTRAINT "v9_slate_blocks_quote_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_quote_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_slate_list_rows_locales" ADD CONSTRAINT "v9_slate_blocks_slate_list_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_slate_list_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_footnote_locales" ADD CONSTRAINT "v9_slate_blocks_footnote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_footnote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_request_locales" ADD CONSTRAINT "v9_slate_blocks_request_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_request"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_ledger_rows_locales" ADD CONSTRAINT "v9_slate_blocks_ledger_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_ledger_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_ledger_locales" ADD CONSTRAINT "v9_slate_blocks_ledger_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_archival_locales" ADD CONSTRAINT "v9_slate_blocks_archival_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_archival"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_division_strip_divisions_locales" ADD CONSTRAINT "v9_slate_blocks_division_strip_divisions_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_division_strip_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_mood_grid_items_locales" ADD CONSTRAINT "v9_slate_blocks_mood_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_mood_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_mood_grid_locales" ADD CONSTRAINT "v9_slate_blocks_mood_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_mood_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_founding_roll_locales" ADD CONSTRAINT "v9_slate_blocks_founding_roll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate_blocks_founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_locales" ADD CONSTRAINT "v9_slate_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_photo_fold_locales" ADD CONSTRAINT "v9_craft_blocks_photo_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_photo_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_route_line_links_locales" ADD CONSTRAINT "v9_craft_blocks_route_line_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_route_line_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_text_fold_locales" ADD CONSTRAINT "v9_craft_blocks_text_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_text_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_quote_feature_locales" ADD CONSTRAINT "v9_craft_blocks_quote_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_quote_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_slate_list_rows_locales" ADD CONSTRAINT "v9_craft_blocks_slate_list_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_slate_list_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_footnote_locales" ADD CONSTRAINT "v9_craft_blocks_footnote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_footnote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_request_locales" ADD CONSTRAINT "v9_craft_blocks_request_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_request"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_ledger_rows_locales" ADD CONSTRAINT "v9_craft_blocks_ledger_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_ledger_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_ledger_locales" ADD CONSTRAINT "v9_craft_blocks_ledger_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_archival_locales" ADD CONSTRAINT "v9_craft_blocks_archival_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_archival"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_division_strip_divisions_locales" ADD CONSTRAINT "v9_craft_blocks_division_strip_divisions_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_division_strip_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_mood_grid_items_locales" ADD CONSTRAINT "v9_craft_blocks_mood_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_mood_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_mood_grid_locales" ADD CONSTRAINT "v9_craft_blocks_mood_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_mood_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_founding_roll_locales" ADD CONSTRAINT "v9_craft_blocks_founding_roll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft_blocks_founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_locales" ADD CONSTRAINT "v9_craft_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_photo_fold_locales" ADD CONSTRAINT "v9_methods_blocks_photo_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_photo_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_route_line_links_locales" ADD CONSTRAINT "v9_methods_blocks_route_line_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_route_line_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_text_fold_locales" ADD CONSTRAINT "v9_methods_blocks_text_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_text_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_quote_feature_locales" ADD CONSTRAINT "v9_methods_blocks_quote_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_quote_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_slate_list_rows_locales" ADD CONSTRAINT "v9_methods_blocks_slate_list_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_slate_list_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_footnote_locales" ADD CONSTRAINT "v9_methods_blocks_footnote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_footnote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_request_locales" ADD CONSTRAINT "v9_methods_blocks_request_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_request"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_ledger_rows_locales" ADD CONSTRAINT "v9_methods_blocks_ledger_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_ledger_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_ledger_locales" ADD CONSTRAINT "v9_methods_blocks_ledger_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_archival_locales" ADD CONSTRAINT "v9_methods_blocks_archival_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_archival"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_division_strip_divisions_locales" ADD CONSTRAINT "v9_methods_blocks_division_strip_divisions_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_division_strip_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_mood_grid_items_locales" ADD CONSTRAINT "v9_methods_blocks_mood_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_mood_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_mood_grid_locales" ADD CONSTRAINT "v9_methods_blocks_mood_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_mood_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_founding_roll_locales" ADD CONSTRAINT "v9_methods_blocks_founding_roll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods_blocks_founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_locales" ADD CONSTRAINT "v9_methods_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_photo_fold_locales" ADD CONSTRAINT "v9_contact_blocks_photo_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_photo_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_route_line_links_locales" ADD CONSTRAINT "v9_contact_blocks_route_line_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_route_line_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_text_fold_locales" ADD CONSTRAINT "v9_contact_blocks_text_fold_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_text_fold"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_quote_feature_locales" ADD CONSTRAINT "v9_contact_blocks_quote_feature_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_quote_feature"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_slate_list_rows_locales" ADD CONSTRAINT "v9_contact_blocks_slate_list_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_slate_list_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_footnote_locales" ADD CONSTRAINT "v9_contact_blocks_footnote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_footnote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_request_locales" ADD CONSTRAINT "v9_contact_blocks_request_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_request"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_ledger_rows_locales" ADD CONSTRAINT "v9_contact_blocks_ledger_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_ledger_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_ledger_locales" ADD CONSTRAINT "v9_contact_blocks_ledger_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_archival_locales" ADD CONSTRAINT "v9_contact_blocks_archival_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_archival"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_division_strip_divisions_locales" ADD CONSTRAINT "v9_contact_blocks_division_strip_divisions_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_division_strip_divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_mood_grid_items_locales" ADD CONSTRAINT "v9_contact_blocks_mood_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_mood_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_mood_grid_locales" ADD CONSTRAINT "v9_contact_blocks_mood_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_mood_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_founding_roll_locales" ADD CONSTRAINT "v9_contact_blocks_founding_roll_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact_blocks_founding_roll"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_locales" ADD CONSTRAINT "v9_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_gallery_locales_locale_parent_id_unique" ON "projects_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_hero_slider_items_locales_locale_parent_id_u" ON "projects_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_hero_locales_locale_parent_id_unique" ON "projects_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_rich_text_locales_locale_parent_id_unique" ON "projects_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_two_col_locales_locale_parent_id_unique" ON "projects_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_grid_items_locales_locale_parent_id_unique" ON "projects_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_grid_locales_locale_parent_id_unique" ON "projects_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_cta_buttons_locales_locale_parent_id_unique" ON "projects_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_cta_locales_locale_parent_id_unique" ON "projects_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_quotes_quotes_locales_locale_parent_id_uniqu" ON "projects_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_quotes_locales_locale_parent_id_unique" ON "projects_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_filmstrip_tiles_locales_locale_parent_id_uni" ON "projects_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_division_showcase_divisions_locales_locale_p" ON "projects_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_division_showcase_locales_locale_parent_id_u" ON "projects_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_stats_stats_locales_locale_parent_id_unique" ON "projects_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_stats_locales_locale_parent_id_unique" ON "projects_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_divider_locales_locale_parent_id_unique" ON "projects_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_blocks_zine_synopsis_locales_locale_parent_id_uniqu" ON "projects_blocks_zine_synopsis_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_hero_slider_items_locales_locale_parent_id_uniqu" ON "news_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_hero_locales_locale_parent_id_unique" ON "news_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_rich_text_locales_locale_parent_id_unique" ON "news_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_two_col_locales_locale_parent_id_unique" ON "news_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_grid_items_locales_locale_parent_id_unique" ON "news_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_grid_locales_locale_parent_id_unique" ON "news_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_cta_buttons_locales_locale_parent_id_unique" ON "news_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_cta_locales_locale_parent_id_unique" ON "news_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "news_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_quotes_locales_locale_parent_id_unique" ON "news_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "news_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_division_showcase_divisions_locales_locale_paren" ON "news_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_division_showcase_locales_locale_parent_id_uniqu" ON "news_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_stats_stats_locales_locale_parent_id_unique" ON "news_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_stats_locales_locale_parent_id_unique" ON "news_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_blocks_divider_locales_locale_parent_id_unique" ON "news_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_cover_lines_locales_locale_parent_id_unique" ON "dispatch_issues_cover_lines_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_cover_coverlines_locales_locale_parent_id_un" ON "dispatch_issues_cover_coverlines_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_contents_entries_locales_locale_parent_id_un" ON "dispatch_issues_contents_entries_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_contents_locales_locale_parent_id_unique" ON "dispatch_issues_contents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_editorial_paragraphs_locales_locale_parent_i" ON "dispatch_issues_editorial_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_feature_title_parts_locales_locale_parent_id" ON "dispatch_issues_feature_title_parts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_feature_meta_locales_locale_parent_id_unique" ON "dispatch_issues_feature_meta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_feature_paragraphs_locales_locale_parent_id_" ON "dispatch_issues_feature_paragraphs_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_feature_factbox_fields_locales_locale_parent" ON "dispatch_issues_feature_factbox_fields_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_feature_related_locales_locale_parent_id_uni" ON "dispatch_issues_feature_related_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_dispatches_locales_locale_parent_id_unique" ON "dispatch_issues_dispatches_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_trades_locales_locale_parent_id_unique" ON "dispatch_issues_trades_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_calendar_locales_locale_parent_id_unique" ON "dispatch_issues_calendar_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_classifieds_locales_locale_parent_id_unique" ON "dispatch_issues_classifieds_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_archive_locales_locale_parent_id_unique" ON "dispatch_issues_archive_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dispatch_issues_locales_locale_parent_id_unique" ON "dispatch_issues_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_slider_items_locales_locale_parent_id_uniqu" ON "home_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_locales_locale_parent_id_unique" ON "home_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_rich_text_locales_locale_parent_id_unique" ON "home_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_two_col_locales_locale_parent_id_unique" ON "home_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_grid_items_locales_locale_parent_id_unique" ON "home_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_grid_locales_locale_parent_id_unique" ON "home_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_cta_buttons_locales_locale_parent_id_unique" ON "home_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_cta_locales_locale_parent_id_unique" ON "home_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "home_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_quotes_locales_locale_parent_id_unique" ON "home_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "home_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_division_showcase_divisions_locales_locale_paren" ON "home_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_division_showcase_locales_locale_parent_id_uniqu" ON "home_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_stats_stats_locales_locale_parent_id_unique" ON "home_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_stats_locales_locale_parent_id_unique" ON "home_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_divider_locales_locale_parent_id_unique" ON "home_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_zine_masthead_locales_locale_parent_id_unique" ON "home_blocks_zine_masthead_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_zine_passage_links_locales_locale_parent_id_uniq" ON "home_blocks_zine_passage_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_blocks_zine_passage_locales_locale_parent_id_unique" ON "home_blocks_zine_passage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_enabled_locales_order_idx" ON "site_settings_enabled_locales" USING btree ("order");
  CREATE INDEX "site_settings_enabled_locales_parent_idx" ON "site_settings_enabled_locales" USING btree ("parent_id");
  CREATE UNIQUE INDEX "site_settings_v9_chrome_nav_links_locales_locale_parent_id_u" ON "site_settings_v9_chrome_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_links_primary_nav_locales_locale_parent_id_unique" ON "footer_links_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_links_division_nav_locales_locale_parent_id_unique" ON "footer_links_division_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_links_more_nav_locales_locale_parent_id_unique" ON "footer_links_more_nav_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_hero_slider_items_locales_locale_parent_id_uniq" ON "about_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_hero_locales_locale_parent_id_unique" ON "about_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_rich_text_locales_locale_parent_id_unique" ON "about_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_two_col_locales_locale_parent_id_unique" ON "about_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_grid_items_locales_locale_parent_id_unique" ON "about_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_grid_locales_locale_parent_id_unique" ON "about_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_cta_buttons_locales_locale_parent_id_unique" ON "about_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_cta_locales_locale_parent_id_unique" ON "about_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "about_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_quotes_locales_locale_parent_id_unique" ON "about_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "about_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_division_showcase_divisions_locales_locale_pare" ON "about_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_division_showcase_locales_locale_parent_id_uniq" ON "about_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_stats_stats_locales_locale_parent_id_unique" ON "about_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_stats_locales_locale_parent_id_unique" ON "about_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_blocks_divider_locales_locale_parent_id_unique" ON "about_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_hero_slider_items_locales_locale_parent_id_un" ON "contact_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_hero_locales_locale_parent_id_unique" ON "contact_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_rich_text_locales_locale_parent_id_unique" ON "contact_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_two_col_locales_locale_parent_id_unique" ON "contact_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_grid_items_locales_locale_parent_id_unique" ON "contact_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_grid_locales_locale_parent_id_unique" ON "contact_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_cta_buttons_locales_locale_parent_id_unique" ON "contact_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_cta_locales_locale_parent_id_unique" ON "contact_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "contact_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_quotes_locales_locale_parent_id_unique" ON "contact_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_filmstrip_tiles_locales_locale_parent_id_uniq" ON "contact_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_division_showcase_divisions_locales_locale_pa" ON "contact_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_division_showcase_locales_locale_parent_id_un" ON "contact_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_stats_stats_locales_locale_parent_id_unique" ON "contact_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_stats_locales_locale_parent_id_unique" ON "contact_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_blocks_divider_locales_locale_parent_id_unique" ON "contact_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_hero_slider_items_locales_locale_parent_id_uniqu" ON "jobs_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_hero_locales_locale_parent_id_unique" ON "jobs_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_rich_text_locales_locale_parent_id_unique" ON "jobs_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_two_col_locales_locale_parent_id_unique" ON "jobs_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_grid_items_locales_locale_parent_id_unique" ON "jobs_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_grid_locales_locale_parent_id_unique" ON "jobs_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_cta_buttons_locales_locale_parent_id_unique" ON "jobs_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_cta_locales_locale_parent_id_unique" ON "jobs_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "jobs_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_quotes_locales_locale_parent_id_unique" ON "jobs_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "jobs_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_division_showcase_divisions_locales_locale_paren" ON "jobs_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_division_showcase_locales_locale_parent_id_uniqu" ON "jobs_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_stats_stats_locales_locale_parent_id_unique" ON "jobs_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_stats_locales_locale_parent_id_unique" ON "jobs_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "jobs_blocks_divider_locales_locale_parent_id_unique" ON "jobs_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_hero_slider_items_locales_locale_parent_id_uniq" ON "pitch_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_hero_locales_locale_parent_id_unique" ON "pitch_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_rich_text_locales_locale_parent_id_unique" ON "pitch_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_two_col_locales_locale_parent_id_unique" ON "pitch_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_grid_items_locales_locale_parent_id_unique" ON "pitch_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_grid_locales_locale_parent_id_unique" ON "pitch_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_cta_buttons_locales_locale_parent_id_unique" ON "pitch_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_cta_locales_locale_parent_id_unique" ON "pitch_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "pitch_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_quotes_locales_locale_parent_id_unique" ON "pitch_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "pitch_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_division_showcase_divisions_locales_locale_pare" ON "pitch_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_division_showcase_locales_locale_parent_id_uniq" ON "pitch_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_stats_stats_locales_locale_parent_id_unique" ON "pitch_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_stats_locales_locale_parent_id_unique" ON "pitch_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pitch_blocks_divider_locales_locale_parent_id_unique" ON "pitch_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_hero_slider_items_locales_locale_parent_id_" ON "investors_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_hero_locales_locale_parent_id_unique" ON "investors_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_rich_text_locales_locale_parent_id_unique" ON "investors_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_two_col_locales_locale_parent_id_unique" ON "investors_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_grid_items_locales_locale_parent_id_unique" ON "investors_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_grid_locales_locale_parent_id_unique" ON "investors_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_cta_buttons_locales_locale_parent_id_unique" ON "investors_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_cta_locales_locale_parent_id_unique" ON "investors_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_quotes_quotes_locales_locale_parent_id_uniq" ON "investors_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_quotes_locales_locale_parent_id_unique" ON "investors_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_filmstrip_tiles_locales_locale_parent_id_un" ON "investors_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_division_showcase_divisions_locales_locale_" ON "investors_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_division_showcase_locales_locale_parent_id_" ON "investors_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_stats_stats_locales_locale_parent_id_unique" ON "investors_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_stats_locales_locale_parent_id_unique" ON "investors_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "investors_blocks_divider_locales_locale_parent_id_unique" ON "investors_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_hero_slider_items_locales_locale_parent_id_unique" ON "212_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_hero_locales_locale_parent_id_unique" ON "212_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_rich_text_locales_locale_parent_id_unique" ON "212_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_two_col_locales_locale_parent_id_unique" ON "212_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_grid_items_locales_locale_parent_id_unique" ON "212_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_grid_locales_locale_parent_id_unique" ON "212_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_cta_buttons_locales_locale_parent_id_unique" ON "212_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_cta_locales_locale_parent_id_unique" ON "212_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "212_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_quotes_locales_locale_parent_id_unique" ON "212_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "212_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_division_showcase_divisions_locales_locale_parent" ON "212_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_division_showcase_locales_locale_parent_id_unique" ON "212_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_stats_stats_locales_locale_parent_id_unique" ON "212_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_stats_locales_locale_parent_id_unique" ON "212_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_divider_locales_locale_parent_id_unique" ON "212_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_zine_passage_links_locales_locale_parent_id_uniqu" ON "212_blocks_zine_passage_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "212_blocks_zine_passage_locales_locale_parent_id_unique" ON "212_blocks_zine_passage_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_hero_slider_items_locales_locale_parent_id_unique" ON "310_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_hero_locales_locale_parent_id_unique" ON "310_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_rich_text_locales_locale_parent_id_unique" ON "310_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_two_col_locales_locale_parent_id_unique" ON "310_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_grid_items_locales_locale_parent_id_unique" ON "310_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_grid_locales_locale_parent_id_unique" ON "310_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_cta_buttons_locales_locale_parent_id_unique" ON "310_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_cta_locales_locale_parent_id_unique" ON "310_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "310_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_quotes_locales_locale_parent_id_unique" ON "310_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "310_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_division_showcase_divisions_locales_locale_parent" ON "310_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_division_showcase_locales_locale_parent_id_unique" ON "310_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_stats_stats_locales_locale_parent_id_unique" ON "310_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_stats_locales_locale_parent_id_unique" ON "310_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_divider_locales_locale_parent_id_unique" ON "310_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_zine_passage_links_locales_locale_parent_id_uniqu" ON "310_blocks_zine_passage_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "310_blocks_zine_passage_locales_locale_parent_id_unique" ON "310_blocks_zine_passage_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_hero_slider_items_locales_locale_parent_id_unique" ON "nrc_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_hero_locales_locale_parent_id_unique" ON "nrc_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_rich_text_locales_locale_parent_id_unique" ON "nrc_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_two_col_locales_locale_parent_id_unique" ON "nrc_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_grid_items_locales_locale_parent_id_unique" ON "nrc_blocks_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_grid_locales_locale_parent_id_unique" ON "nrc_blocks_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_cta_buttons_locales_locale_parent_id_unique" ON "nrc_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_cta_locales_locale_parent_id_unique" ON "nrc_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "nrc_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_quotes_locales_locale_parent_id_unique" ON "nrc_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_filmstrip_tiles_locales_locale_parent_id_unique" ON "nrc_blocks_filmstrip_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_division_showcase_divisions_locales_locale_parent" ON "nrc_blocks_division_showcase_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_division_showcase_locales_locale_parent_id_unique" ON "nrc_blocks_division_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_stats_stats_locales_locale_parent_id_unique" ON "nrc_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_stats_locales_locale_parent_id_unique" ON "nrc_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_divider_locales_locale_parent_id_unique" ON "nrc_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_zine_passage_links_locales_locale_parent_id_uniqu" ON "nrc_blocks_zine_passage_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "nrc_blocks_zine_passage_locales_locale_parent_id_unique" ON "nrc_blocks_zine_passage_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_hero_slider_items_locales_locale_parent_id_uni" ON "troupe_blocks_hero_slider_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_hero_locales_locale_parent_id_unique" ON "troupe_blocks_hero_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_playbill_voices_locales_locale_parent_id_uniqu" ON "troupe_blocks_playbill_voices_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_playbill_locales_locale_parent_id_unique" ON "troupe_blocks_playbill_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_rich_text_locales_locale_parent_id_unique" ON "troupe_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_two_col_locales_locale_parent_id_unique" ON "troupe_blocks_two_col_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_cta_buttons_locales_locale_parent_id_unique" ON "troupe_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_cta_locales_locale_parent_id_unique" ON "troupe_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_quotes_quotes_locales_locale_parent_id_unique" ON "troupe_blocks_quotes_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_quotes_locales_locale_parent_id_unique" ON "troupe_blocks_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_stats_stats_locales_locale_parent_id_unique" ON "troupe_blocks_stats_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_stats_locales_locale_parent_id_unique" ON "troupe_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_blocks_divider_locales_locale_parent_id_unique" ON "troupe_blocks_divider_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_program_cast_locales_locale_parent_id_unique" ON "troupe_program_cast_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "troupe_program_locales_locale_parent_id_unique" ON "troupe_program_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_photo_fold_locales_locale_parent_id_unique" ON "v9_home_blocks_photo_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_route_line_links_locales_locale_parent_id_uni" ON "v9_home_blocks_route_line_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_text_fold_locales_locale_parent_id_unique" ON "v9_home_blocks_text_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_quote_feature_locales_locale_parent_id_unique" ON "v9_home_blocks_quote_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_slate_list_rows_locales_locale_parent_id_uniq" ON "v9_home_blocks_slate_list_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_footnote_locales_locale_parent_id_unique" ON "v9_home_blocks_footnote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_request_locales_locale_parent_id_unique" ON "v9_home_blocks_request_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_ledger_rows_locales_locale_parent_id_unique" ON "v9_home_blocks_ledger_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_ledger_locales_locale_parent_id_unique" ON "v9_home_blocks_ledger_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_archival_locales_locale_parent_id_unique" ON "v9_home_blocks_archival_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_division_strip_divisions_locales_locale_paren" ON "v9_home_blocks_division_strip_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_mood_grid_items_locales_locale_parent_id_uniq" ON "v9_home_blocks_mood_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_mood_grid_locales_locale_parent_id_unique" ON "v9_home_blocks_mood_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_blocks_founding_roll_locales_locale_parent_id_unique" ON "v9_home_blocks_founding_roll_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_home_locales_locale_parent_id_unique" ON "v9_home_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_photo_fold_locales_locale_parent_id_unique" ON "v9_slate_blocks_photo_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_route_line_links_locales_locale_parent_id_un" ON "v9_slate_blocks_route_line_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_text_fold_locales_locale_parent_id_unique" ON "v9_slate_blocks_text_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_quote_feature_locales_locale_parent_id_uniqu" ON "v9_slate_blocks_quote_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_slate_list_rows_locales_locale_parent_id_uni" ON "v9_slate_blocks_slate_list_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_footnote_locales_locale_parent_id_unique" ON "v9_slate_blocks_footnote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_request_locales_locale_parent_id_unique" ON "v9_slate_blocks_request_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_ledger_rows_locales_locale_parent_id_unique" ON "v9_slate_blocks_ledger_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_ledger_locales_locale_parent_id_unique" ON "v9_slate_blocks_ledger_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_archival_locales_locale_parent_id_unique" ON "v9_slate_blocks_archival_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_division_strip_divisions_locales_locale_pare" ON "v9_slate_blocks_division_strip_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_mood_grid_items_locales_locale_parent_id_uni" ON "v9_slate_blocks_mood_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_mood_grid_locales_locale_parent_id_unique" ON "v9_slate_blocks_mood_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_blocks_founding_roll_locales_locale_parent_id_uniqu" ON "v9_slate_blocks_founding_roll_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_slate_locales_locale_parent_id_unique" ON "v9_slate_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_photo_fold_locales_locale_parent_id_unique" ON "v9_craft_blocks_photo_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_route_line_links_locales_locale_parent_id_un" ON "v9_craft_blocks_route_line_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_text_fold_locales_locale_parent_id_unique" ON "v9_craft_blocks_text_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_quote_feature_locales_locale_parent_id_uniqu" ON "v9_craft_blocks_quote_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_slate_list_rows_locales_locale_parent_id_uni" ON "v9_craft_blocks_slate_list_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_footnote_locales_locale_parent_id_unique" ON "v9_craft_blocks_footnote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_request_locales_locale_parent_id_unique" ON "v9_craft_blocks_request_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_ledger_rows_locales_locale_parent_id_unique" ON "v9_craft_blocks_ledger_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_ledger_locales_locale_parent_id_unique" ON "v9_craft_blocks_ledger_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_archival_locales_locale_parent_id_unique" ON "v9_craft_blocks_archival_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_division_strip_divisions_locales_locale_pare" ON "v9_craft_blocks_division_strip_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_mood_grid_items_locales_locale_parent_id_uni" ON "v9_craft_blocks_mood_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_mood_grid_locales_locale_parent_id_unique" ON "v9_craft_blocks_mood_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_blocks_founding_roll_locales_locale_parent_id_uniqu" ON "v9_craft_blocks_founding_roll_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_craft_locales_locale_parent_id_unique" ON "v9_craft_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_photo_fold_locales_locale_parent_id_unique" ON "v9_methods_blocks_photo_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_route_line_links_locales_locale_parent_id_" ON "v9_methods_blocks_route_line_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_text_fold_locales_locale_parent_id_unique" ON "v9_methods_blocks_text_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_quote_feature_locales_locale_parent_id_uni" ON "v9_methods_blocks_quote_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_slate_list_rows_locales_locale_parent_id_u" ON "v9_methods_blocks_slate_list_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_footnote_locales_locale_parent_id_unique" ON "v9_methods_blocks_footnote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_request_locales_locale_parent_id_unique" ON "v9_methods_blocks_request_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_ledger_rows_locales_locale_parent_id_uniqu" ON "v9_methods_blocks_ledger_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_ledger_locales_locale_parent_id_unique" ON "v9_methods_blocks_ledger_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_archival_locales_locale_parent_id_unique" ON "v9_methods_blocks_archival_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_division_strip_divisions_locales_locale_pa" ON "v9_methods_blocks_division_strip_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_mood_grid_items_locales_locale_parent_id_u" ON "v9_methods_blocks_mood_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_mood_grid_locales_locale_parent_id_unique" ON "v9_methods_blocks_mood_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_blocks_founding_roll_locales_locale_parent_id_uni" ON "v9_methods_blocks_founding_roll_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_methods_locales_locale_parent_id_unique" ON "v9_methods_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_photo_fold_locales_locale_parent_id_unique" ON "v9_contact_blocks_photo_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_route_line_links_locales_locale_parent_id_" ON "v9_contact_blocks_route_line_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_text_fold_locales_locale_parent_id_unique" ON "v9_contact_blocks_text_fold_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_quote_feature_locales_locale_parent_id_uni" ON "v9_contact_blocks_quote_feature_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_slate_list_rows_locales_locale_parent_id_u" ON "v9_contact_blocks_slate_list_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_footnote_locales_locale_parent_id_unique" ON "v9_contact_blocks_footnote_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_request_locales_locale_parent_id_unique" ON "v9_contact_blocks_request_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_ledger_rows_locales_locale_parent_id_uniqu" ON "v9_contact_blocks_ledger_rows_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_ledger_locales_locale_parent_id_unique" ON "v9_contact_blocks_ledger_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_archival_locales_locale_parent_id_unique" ON "v9_contact_blocks_archival_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_division_strip_divisions_locales_locale_pa" ON "v9_contact_blocks_division_strip_divisions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_mood_grid_items_locales_locale_parent_id_u" ON "v9_contact_blocks_mood_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_mood_grid_locales_locale_parent_id_unique" ON "v9_contact_blocks_mood_grid_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_blocks_founding_roll_locales_locale_parent_id_uni" ON "v9_contact_blocks_founding_roll_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "v9_contact_locales_locale_parent_id_unique" ON "v9_contact_locales" USING btree ("_locale","_parent_id");
`)

  // 2. DATA MOVE — the English values are copied into the new _locales tables
  //    BEFORE the base columns are dropped. Payload's generator does not do this;
  //    without it every existing English string on the site would be destroyed.
  await db.execute(sql`
  -- Site Settings existed before this field did: give the singleton the default
  -- value the field declares, so the admin can save it without Marco first
  -- having to pick English out of a list that is required and empty.
  INSERT INTO "site_settings_enabled_locales" ("order", "parent_id", "value")
    SELECT 1, "id", 'en' FROM "site_settings";
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT COALESCE("alt", ''), 'en', "id" FROM "media" WHERE "alt" IS NOT NULL;
  INSERT INTO "projects_gallery_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", COALESCE("credit", ''), 'en', "id" FROM "projects_gallery" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "projects_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "projects_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "projects_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "projects_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "projects_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "projects_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "projects_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "projects_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "projects_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "projects_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "projects_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "projects_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "projects_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "projects_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "projects_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "projects_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "projects_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "projects_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "projects_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "projects_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "projects_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "projects_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "projects_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "projects_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "projects_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "projects_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "projects_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "projects_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "projects_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "projects_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "projects_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "projects_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "projects_blocks_zine_synopsis_locales" ("kicker", "logline", "body", "note", "_locale", "_parent_id")
    SELECT "kicker", "logline", COALESCE("body", ''), "note", 'en', "id" FROM "projects_blocks_zine_synopsis" WHERE "kicker" IS NOT NULL OR "logline" IS NOT NULL OR "body" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "projects_locales" ("subtitle", "story_place", "logline", "short_logline", "provenance", "meta_line", "body_prose", "page_quote_quote", "page_quote_cite", "page_quote_note", "hero_line", "hero_caption", "hero_credit", "request_body", "synopsis", "pitch_deck_note", "_locale", "_parent_id")
    SELECT "subtitle", "story_place", "logline", "short_logline", "provenance", "meta_line", "body_prose", "page_quote_quote", "page_quote_cite", "page_quote_note", "hero_line", "hero_caption", "hero_credit", "request_body", "synopsis", "pitch_deck_note", 'en', "id" FROM "projects" WHERE "subtitle" IS NOT NULL OR "story_place" IS NOT NULL OR "logline" IS NOT NULL OR "short_logline" IS NOT NULL OR "provenance" IS NOT NULL OR "meta_line" IS NOT NULL OR "body_prose" IS NOT NULL OR "page_quote_quote" IS NOT NULL OR "page_quote_cite" IS NOT NULL OR "page_quote_note" IS NOT NULL OR "hero_line" IS NOT NULL OR "hero_caption" IS NOT NULL OR "hero_credit" IS NOT NULL OR "request_body" IS NOT NULL OR "synopsis" IS NOT NULL OR "pitch_deck_note" IS NOT NULL;
  INSERT INTO "news_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "news_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "news_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "news_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "news_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "news_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "news_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "news_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "news_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "news_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "news_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "news_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "news_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "news_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "news_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "news_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "news_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "news_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "news_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "news_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "news_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "news_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "news_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "news_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "news_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "news_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "news_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "news_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "news_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "news_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "news_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "news_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "news_locales" ("title", "deck", "_locale", "_parent_id")
    SELECT COALESCE("title", ''), "deck", 'en', "id" FROM "news" WHERE "title" IS NOT NULL OR "deck" IS NOT NULL;
  INSERT INTO "dispatch_issues_cover_lines_locales" ("text", "_locale", "_parent_id")
    SELECT COALESCE("text", ''), 'en', "id" FROM "dispatch_issues_cover_lines" WHERE "text" IS NOT NULL;
  INSERT INTO "dispatch_issues_cover_coverlines_locales" ("head", "deck", "_locale", "_parent_id")
    SELECT "head", "deck", 'en', "id" FROM "dispatch_issues_cover_coverlines" WHERE "head" IS NOT NULL OR "deck" IS NOT NULL;
  INSERT INTO "dispatch_issues_contents_entries_locales" ("title", "deck", "by", "_locale", "_parent_id")
    SELECT COALESCE("title", ''), "deck", "by", 'en', "id" FROM "dispatch_issues_contents_entries" WHERE "title" IS NOT NULL OR "deck" IS NOT NULL OR "by" IS NOT NULL;
  INSERT INTO "dispatch_issues_contents_locales" ("label", "meta", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), "meta", 'en', "id" FROM "dispatch_issues_contents" WHERE "label" IS NOT NULL OR "meta" IS NOT NULL;
  INSERT INTO "dispatch_issues_editorial_paragraphs_locales" ("text", "_locale", "_parent_id")
    SELECT COALESCE("text", ''), 'en', "id" FROM "dispatch_issues_editorial_paragraphs" WHERE "text" IS NOT NULL;
  INSERT INTO "dispatch_issues_feature_title_parts_locales" ("text", "_locale", "_parent_id")
    SELECT COALESCE("text", ''), 'en', "id" FROM "dispatch_issues_feature_title_parts" WHERE "text" IS NOT NULL;
  INSERT INTO "dispatch_issues_feature_meta_locales" ("value", "_locale", "_parent_id")
    SELECT COALESCE("value", ''), 'en', "id" FROM "dispatch_issues_feature_meta" WHERE "value" IS NOT NULL;
  INSERT INTO "dispatch_issues_feature_paragraphs_locales" ("text", "attr", "_locale", "_parent_id")
    SELECT COALESCE("text", ''), "attr", 'en', "id" FROM "dispatch_issues_feature_paragraphs" WHERE "text" IS NOT NULL OR "attr" IS NOT NULL;
  INSERT INTO "dispatch_issues_feature_factbox_fields_locales" ("value", "_locale", "_parent_id")
    SELECT COALESCE("value", ''), 'en', "id" FROM "dispatch_issues_feature_factbox_fields" WHERE "value" IS NOT NULL;
  INSERT INTO "dispatch_issues_feature_related_locales" ("meta", "_locale", "_parent_id")
    SELECT "meta", 'en', "id" FROM "dispatch_issues_feature_related" WHERE "meta" IS NOT NULL;
  INSERT INTO "dispatch_issues_dispatches_locales" ("date", "title", "body", "status", "ghost", "_locale", "_parent_id")
    SELECT COALESCE("date", ''), COALESCE("title", ''), "body", "status", "ghost", 'en', "id" FROM "dispatch_issues_dispatches" WHERE "date" IS NOT NULL OR "title" IS NOT NULL OR "body" IS NOT NULL OR "status" IS NOT NULL OR "ghost" IS NOT NULL;
  INSERT INTO "dispatch_issues_trades_locales" ("city", "headline", "deck", "attr", "_locale", "_parent_id")
    SELECT "city", COALESCE("headline", ''), "deck", "attr", 'en', "id" FROM "dispatch_issues_trades" WHERE "city" IS NOT NULL OR "headline" IS NOT NULL OR "deck" IS NOT NULL OR "attr" IS NOT NULL;
  INSERT INTO "dispatch_issues_calendar_locales" ("date", "title", "sub", "tag", "_locale", "_parent_id")
    SELECT COALESCE("date", ''), COALESCE("title", ''), "sub", "tag", 'en', "id" FROM "dispatch_issues_calendar" WHERE "date" IS NOT NULL OR "title" IS NOT NULL OR "sub" IS NOT NULL OR "tag" IS NOT NULL;
  INSERT INTO "dispatch_issues_classifieds_locales" ("cat", "title", "body", "meta", "_locale", "_parent_id")
    SELECT COALESCE("cat", ''), COALESCE("title", ''), "body", "meta", 'en', "id" FROM "dispatch_issues_classifieds" WHERE "cat" IS NOT NULL OR "title" IS NOT NULL OR "body" IS NOT NULL OR "meta" IS NOT NULL;
  INSERT INTO "dispatch_issues_archive_locales" ("season", "line", "state", "_locale", "_parent_id")
    SELECT "season", "line", "state", 'en', "id" FROM "dispatch_issues_archive" WHERE "season" IS NOT NULL OR "line" IS NOT NULL OR "state" IS NOT NULL;
  INSERT INTO "dispatch_issues_locales" ("display_title", "indicia_season", "indicia_print_run", "indicia_offices", "indicia_tagline", "cover_kicker", "cover_deck", "cover_byline", "editorial_eyebrow", "editorial_title", "editorial_lead", "editorial_signature_name", "editorial_signature_meta", "editorial_quote", "feature_eyebrow", "feature_deck", "feature_image_caption_caption", "feature_image_caption_credit", "feature_factbox_label", "colophon_legal", "colophon_type", "colophon_baseline", "_locale", "_parent_id")
    SELECT COALESCE("display_title", ''), COALESCE("indicia_season", ''), "indicia_print_run", "indicia_offices", "indicia_tagline", "cover_kicker", "cover_deck", "cover_byline", "editorial_eyebrow", "editorial_title", "editorial_lead", "editorial_signature_name", "editorial_signature_meta", "editorial_quote", "feature_eyebrow", "feature_deck", "feature_image_caption_caption", "feature_image_caption_credit", "feature_factbox_label", "colophon_legal", "colophon_type", "colophon_baseline", 'en', "id" FROM "dispatch_issues" WHERE "display_title" IS NOT NULL OR "indicia_season" IS NOT NULL OR "indicia_print_run" IS NOT NULL OR "indicia_offices" IS NOT NULL OR "indicia_tagline" IS NOT NULL OR "cover_kicker" IS NOT NULL OR "cover_deck" IS NOT NULL OR "cover_byline" IS NOT NULL OR "editorial_eyebrow" IS NOT NULL OR "editorial_title" IS NOT NULL OR "editorial_lead" IS NOT NULL OR "editorial_signature_name" IS NOT NULL OR "editorial_signature_meta" IS NOT NULL OR "editorial_quote" IS NOT NULL OR "feature_eyebrow" IS NOT NULL OR "feature_deck" IS NOT NULL OR "feature_image_caption_caption" IS NOT NULL OR "feature_image_caption_credit" IS NOT NULL OR "feature_factbox_label" IS NOT NULL OR "colophon_legal" IS NOT NULL OR "colophon_type" IS NOT NULL OR "colophon_baseline" IS NOT NULL;
  INSERT INTO "home_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "home_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "home_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "home_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "home_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "home_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "home_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "home_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "home_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "home_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "home_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "home_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "home_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "home_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "home_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "home_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "home_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "home_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "home_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "home_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "home_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "home_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "home_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "home_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "home_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "home_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "home_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "home_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "home_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "home_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "home_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "home_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "home_blocks_zine_masthead_locales" ("offices_line", "issue_label", "dek", "_locale", "_parent_id")
    SELECT "offices_line", "issue_label", "dek", 'en', "id" FROM "home_blocks_zine_masthead" WHERE "offices_line" IS NOT NULL OR "issue_label" IS NOT NULL OR "dek" IS NOT NULL;
  INSERT INTO "home_blocks_zine_passage_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "home_blocks_zine_passage_links" WHERE "label" IS NOT NULL;
  INSERT INTO "home_blocks_zine_passage_locales" ("kicker", "heading", "lede", "body", "_locale", "_parent_id")
    SELECT "kicker", COALESCE("heading", ''), "lede", "body", 'en', "id" FROM "home_blocks_zine_passage" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "site_settings_v9_chrome_nav_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "site_settings_v9_chrome_nav_links" WHERE "label" IS NOT NULL;
  INSERT INTO "site_settings_locales" ("tagline", "ai_mark_text", "v9_chrome_display_label", "v9_chrome_panel_title", "v9_chrome_theme_label", "v9_chrome_theme_premiere", "v9_chrome_theme_matinee", "v9_chrome_theme_lateshow", "v9_chrome_scale_label", "v9_chrome_logo_label", "v9_chrome_top_label", "v9_chrome_prev_label", "v9_chrome_next_label", "v9_chrome_slate_return", "v9_chrome_cta", "v9_chrome_colophon", "v9_chrome_copyright", "dispatch_nav_label", "troupe_nav_label", "_locale", "_parent_id")
    SELECT "tagline", "ai_mark_text", "v9_chrome_display_label", "v9_chrome_panel_title", "v9_chrome_theme_label", "v9_chrome_theme_premiere", "v9_chrome_theme_matinee", "v9_chrome_theme_lateshow", "v9_chrome_scale_label", "v9_chrome_logo_label", "v9_chrome_top_label", "v9_chrome_prev_label", "v9_chrome_next_label", "v9_chrome_slate_return", "v9_chrome_cta", "v9_chrome_colophon", "v9_chrome_copyright", "dispatch_nav_label", "troupe_nav_label", 'en', "id" FROM "site_settings" WHERE "tagline" IS NOT NULL OR "ai_mark_text" IS NOT NULL OR "v9_chrome_display_label" IS NOT NULL OR "v9_chrome_panel_title" IS NOT NULL OR "v9_chrome_theme_label" IS NOT NULL OR "v9_chrome_theme_premiere" IS NOT NULL OR "v9_chrome_theme_matinee" IS NOT NULL OR "v9_chrome_theme_lateshow" IS NOT NULL OR "v9_chrome_scale_label" IS NOT NULL OR "v9_chrome_logo_label" IS NOT NULL OR "v9_chrome_top_label" IS NOT NULL OR "v9_chrome_prev_label" IS NOT NULL OR "v9_chrome_next_label" IS NOT NULL OR "v9_chrome_slate_return" IS NOT NULL OR "v9_chrome_cta" IS NOT NULL OR "v9_chrome_colophon" IS NOT NULL OR "v9_chrome_copyright" IS NOT NULL OR "dispatch_nav_label" IS NOT NULL OR "troupe_nav_label" IS NOT NULL;
  INSERT INTO "footer_links_primary_nav_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "footer_links_primary_nav" WHERE "label" IS NOT NULL;
  INSERT INTO "footer_links_division_nav_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "footer_links_division_nav" WHERE "label" IS NOT NULL;
  INSERT INTO "footer_links_more_nav_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "footer_links_more_nav" WHERE "label" IS NOT NULL;
  INSERT INTO "about_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "about_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "about_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "about_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "about_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "about_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "about_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "about_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "about_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "about_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "about_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "about_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "about_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "about_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "about_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "about_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "about_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "about_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "about_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "about_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "about_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "about_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "about_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "about_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "about_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "about_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "about_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "about_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "about_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "about_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "about_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "about_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "contact_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "contact_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "contact_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "contact_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "contact_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "contact_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "contact_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "contact_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "contact_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "contact_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "contact_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "contact_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "contact_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "contact_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "contact_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "contact_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "contact_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "contact_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "contact_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "contact_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "contact_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "contact_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "contact_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "contact_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "contact_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "contact_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "contact_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "contact_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "contact_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "contact_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "contact_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "contact_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "jobs_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "jobs_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "jobs_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "jobs_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "jobs_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "jobs_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "jobs_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "jobs_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "jobs_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "jobs_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "jobs_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "jobs_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "jobs_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "jobs_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "jobs_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "jobs_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "jobs_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "jobs_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "jobs_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "jobs_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "jobs_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "jobs_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "jobs_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "jobs_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "jobs_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "jobs_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "jobs_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "jobs_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "jobs_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "jobs_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "jobs_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "jobs_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "pitch_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "pitch_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "pitch_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "pitch_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "pitch_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "pitch_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "pitch_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "pitch_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "pitch_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "pitch_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "pitch_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "pitch_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "pitch_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "pitch_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "pitch_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "pitch_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "pitch_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "pitch_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "pitch_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "pitch_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "pitch_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "pitch_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "pitch_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "pitch_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "pitch_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "pitch_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "pitch_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "pitch_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "pitch_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "pitch_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "pitch_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "pitch_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "investors_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "investors_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "investors_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "investors_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "investors_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "investors_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "investors_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "investors_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "investors_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "investors_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "investors_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "investors_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "investors_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "investors_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "investors_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "investors_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "investors_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "investors_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "investors_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "investors_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "investors_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "investors_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "investors_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "investors_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "investors_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "investors_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "investors_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "investors_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "investors_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "investors_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "investors_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "investors_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "212_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "212_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "212_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "212_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "212_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "212_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "212_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "212_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "212_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "212_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "212_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "212_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "212_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "212_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "212_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "212_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "212_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "212_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "212_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "212_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "212_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "212_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "212_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "212_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "212_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "212_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "212_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "212_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "212_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "212_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "212_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "212_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "212_blocks_zine_passage_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "212_blocks_zine_passage_links" WHERE "label" IS NOT NULL;
  INSERT INTO "212_blocks_zine_passage_locales" ("kicker", "heading", "lede", "body", "_locale", "_parent_id")
    SELECT "kicker", COALESCE("heading", ''), "lede", "body", 'en', "id" FROM "212_blocks_zine_passage" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "310_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "310_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "310_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "310_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "310_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "310_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "310_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "310_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "310_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "310_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "310_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "310_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "310_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "310_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "310_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "310_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "310_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "310_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "310_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "310_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "310_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "310_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "310_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "310_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "310_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "310_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "310_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "310_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "310_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "310_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "310_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "310_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "310_blocks_zine_passage_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "310_blocks_zine_passage_links" WHERE "label" IS NOT NULL;
  INSERT INTO "310_blocks_zine_passage_locales" ("kicker", "heading", "lede", "body", "_locale", "_parent_id")
    SELECT "kicker", COALESCE("heading", ''), "lede", "body", 'en', "id" FROM "310_blocks_zine_passage" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "nrc_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "nrc_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "nrc_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "nrc_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "nrc_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "nrc_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "nrc_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "nrc_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "nrc_blocks_grid_items_locales" ("title", "description", "_locale", "_parent_id")
    SELECT "title", "description", 'en', "id" FROM "nrc_blocks_grid_items" WHERE "title" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "nrc_blocks_grid_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "nrc_blocks_grid" WHERE "heading" IS NOT NULL;
  INSERT INTO "nrc_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "nrc_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "nrc_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "nrc_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "nrc_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "nrc_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "nrc_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "nrc_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "nrc_blocks_filmstrip_tiles_locales" ("caption", "_locale", "_parent_id")
    SELECT "caption", 'en', "id" FROM "nrc_blocks_filmstrip_tiles" WHERE "caption" IS NOT NULL;
  INSERT INTO "nrc_blocks_division_showcase_divisions_locales" ("subtitle", "description", "_locale", "_parent_id")
    SELECT "subtitle", "description", 'en', "id" FROM "nrc_blocks_division_showcase_divisions" WHERE "subtitle" IS NOT NULL OR "description" IS NOT NULL;
  INSERT INTO "nrc_blocks_division_showcase_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT "heading", "subtext", 'en', "id" FROM "nrc_blocks_division_showcase" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "nrc_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "nrc_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "nrc_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "nrc_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "nrc_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "nrc_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "nrc_blocks_zine_passage_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "nrc_blocks_zine_passage_links" WHERE "label" IS NOT NULL;
  INSERT INTO "nrc_blocks_zine_passage_locales" ("kicker", "heading", "lede", "body", "_locale", "_parent_id")
    SELECT "kicker", COALESCE("heading", ''), "lede", "body", 'en', "id" FROM "nrc_blocks_zine_passage" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL;
  INSERT INTO "troupe_blocks_hero_slider_items_locales" ("title", "subtext", "_locale", "_parent_id")
    SELECT "title", "subtext", 'en', "id" FROM "troupe_blocks_hero_slider_items" WHERE "title" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "troupe_blocks_hero_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "troupe_blocks_hero" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "troupe_blocks_playbill_voices_locales" ("voice", "descriptor", "roles", "note", "_locale", "_parent_id")
    SELECT COALESCE("voice", ''), "descriptor", COALESCE("roles", ''), "note", 'en', "id" FROM "troupe_blocks_playbill_voices" WHERE "voice" IS NOT NULL OR "descriptor" IS NOT NULL OR "roles" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "troupe_blocks_playbill_locales" ("program_number", "subtitle", "runtime", "notes", "_locale", "_parent_id")
    SELECT "program_number", "subtitle", "runtime", "notes", 'en', "id" FROM "troupe_blocks_playbill" WHERE "program_number" IS NOT NULL OR "subtitle" IS NOT NULL OR "runtime" IS NOT NULL OR "notes" IS NOT NULL;
  INSERT INTO "troupe_blocks_rich_text_locales" ("content", "_locale", "_parent_id")
    SELECT COALESCE("content", '{}'::jsonb), 'en', "id" FROM "troupe_blocks_rich_text" WHERE "content" IS NOT NULL;
  INSERT INTO "troupe_blocks_two_col_locales" ("left_heading", "right_body", "_locale", "_parent_id")
    SELECT COALESCE("left_heading", ''), COALESCE("right_body", '{}'::jsonb), 'en', "id" FROM "troupe_blocks_two_col" WHERE "left_heading" IS NOT NULL OR "right_body" IS NOT NULL;
  INSERT INTO "troupe_blocks_cta_buttons_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "troupe_blocks_cta_buttons" WHERE "label" IS NOT NULL;
  INSERT INTO "troupe_blocks_cta_locales" ("heading", "subtext", "_locale", "_parent_id")
    SELECT COALESCE("heading", ''), "subtext", 'en', "id" FROM "troupe_blocks_cta" WHERE "heading" IS NOT NULL OR "subtext" IS NOT NULL;
  INSERT INTO "troupe_blocks_quotes_quotes_locales" ("quote", "attribution", "_locale", "_parent_id")
    SELECT COALESCE("quote", ''), "attribution", 'en', "id" FROM "troupe_blocks_quotes_quotes" WHERE "quote" IS NOT NULL OR "attribution" IS NOT NULL;
  INSERT INTO "troupe_blocks_quotes_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "troupe_blocks_quotes" WHERE "heading" IS NOT NULL;
  INSERT INTO "troupe_blocks_stats_stats_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "troupe_blocks_stats_stats" WHERE "label" IS NOT NULL;
  INSERT INTO "troupe_blocks_stats_locales" ("heading", "_locale", "_parent_id")
    SELECT "heading", 'en', "id" FROM "troupe_blocks_stats" WHERE "heading" IS NOT NULL;
  INSERT INTO "troupe_blocks_divider_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'en', "id" FROM "troupe_blocks_divider" WHERE "label" IS NOT NULL;
  INSERT INTO "troupe_program_cast_locales" ("role", "_locale", "_parent_id")
    SELECT "role", 'en', "id" FROM "troupe_program_cast" WHERE "role" IS NOT NULL;
  INSERT INTO "troupe_program_locales" ("subtitle", "logline", "programme_note", "credits", "_locale", "_parent_id")
    SELECT "subtitle", "logline", "programme_note", "credits", 'en', "id" FROM "troupe_program" WHERE "subtitle" IS NOT NULL OR "logline" IS NOT NULL OR "programme_note" IS NOT NULL OR "credits" IS NOT NULL;
  INSERT INTO "v9_home_blocks_photo_fold_locales" ("kicker", "heading", "caption", "credit", "_locale", "_parent_id")
    SELECT "kicker", "heading", "caption", "credit", 'en', "id" FROM "v9_home_blocks_photo_fold" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_home_blocks_route_line_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "v9_home_blocks_route_line_links" WHERE "label" IS NOT NULL;
  INSERT INTO "v9_home_blocks_text_fold_locales" ("scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", 'en', "id" FROM "v9_home_blocks_text_fold" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL OR "quote" IS NOT NULL OR "cite" IS NOT NULL OR "more_label" IS NOT NULL OR "link_label" IS NOT NULL OR "aria_label" IS NOT NULL;
  INSERT INTO "v9_home_blocks_quote_feature_locales" ("quote", "cite", "note", "_locale", "_parent_id")
    SELECT "quote", "cite", "note", 'en', "id" FROM "v9_home_blocks_quote_feature" WHERE "quote" IS NOT NULL OR "cite" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "v9_home_blocks_slate_list_rows_locales" ("logline", "provenance", "_locale", "_parent_id")
    SELECT "logline", "provenance", 'en', "id" FROM "v9_home_blocks_slate_list_rows" WHERE "logline" IS NOT NULL OR "provenance" IS NOT NULL;
  INSERT INTO "v9_home_blocks_footnote_locales" ("body", "_locale", "_parent_id")
    SELECT "body", 'en', "id" FROM "v9_home_blocks_footnote" WHERE "body" IS NOT NULL;
  INSERT INTO "v9_home_blocks_request_locales" ("scene_slug", "heading", "body", "link_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "link_label", 'en', "id" FROM "v9_home_blocks_request" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "v9_home_blocks_ledger_rows_locales" ("term", "definition", "_locale", "_parent_id")
    SELECT "term", "definition", 'en', "id" FROM "v9_home_blocks_ledger_rows" WHERE "term" IS NOT NULL OR "definition" IS NOT NULL;
  INSERT INTO "v9_home_blocks_ledger_locales" ("aria_label", "_locale", "_parent_id")
    SELECT "aria_label", 'en', "id" FROM "v9_home_blocks_ledger" WHERE "aria_label" IS NOT NULL;
  INSERT INTO "v9_home_blocks_archival_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_home_blocks_archival" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_home_blocks_division_strip_divisions_locales" ("blurb", "_locale", "_parent_id")
    SELECT "blurb", 'en', "id" FROM "v9_home_blocks_division_strip_divisions" WHERE "blurb" IS NOT NULL;
  INSERT INTO "v9_home_blocks_mood_grid_items_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_home_blocks_mood_grid_items" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_home_blocks_mood_grid_locales" ("aria_label", "scene_slug", "heading", "_locale", "_parent_id")
    SELECT "aria_label", "scene_slug", "heading", 'en', "id" FROM "v9_home_blocks_mood_grid" WHERE "aria_label" IS NOT NULL OR "scene_slug" IS NOT NULL OR "heading" IS NOT NULL;
  INSERT INTO "v9_home_blocks_founding_roll_locales" ("scene_slug", "heading", "body", "submit_label", "success_note", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "submit_label", "success_note", 'en', "id" FROM "v9_home_blocks_founding_roll" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "submit_label" IS NOT NULL OR "success_note" IS NOT NULL;
  INSERT INTO "v9_home_locales" ("seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "seo_title", "seo_description", 'en', "id" FROM "v9_home" WHERE "seo_title" IS NOT NULL OR "seo_description" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_photo_fold_locales" ("kicker", "heading", "caption", "credit", "_locale", "_parent_id")
    SELECT "kicker", "heading", "caption", "credit", 'en', "id" FROM "v9_slate_blocks_photo_fold" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_route_line_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "v9_slate_blocks_route_line_links" WHERE "label" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_text_fold_locales" ("scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", 'en', "id" FROM "v9_slate_blocks_text_fold" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL OR "quote" IS NOT NULL OR "cite" IS NOT NULL OR "more_label" IS NOT NULL OR "link_label" IS NOT NULL OR "aria_label" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_quote_feature_locales" ("quote", "cite", "note", "_locale", "_parent_id")
    SELECT "quote", "cite", "note", 'en', "id" FROM "v9_slate_blocks_quote_feature" WHERE "quote" IS NOT NULL OR "cite" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_slate_list_rows_locales" ("logline", "provenance", "_locale", "_parent_id")
    SELECT "logline", "provenance", 'en', "id" FROM "v9_slate_blocks_slate_list_rows" WHERE "logline" IS NOT NULL OR "provenance" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_footnote_locales" ("body", "_locale", "_parent_id")
    SELECT "body", 'en', "id" FROM "v9_slate_blocks_footnote" WHERE "body" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_request_locales" ("scene_slug", "heading", "body", "link_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "link_label", 'en', "id" FROM "v9_slate_blocks_request" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_ledger_rows_locales" ("term", "definition", "_locale", "_parent_id")
    SELECT "term", "definition", 'en', "id" FROM "v9_slate_blocks_ledger_rows" WHERE "term" IS NOT NULL OR "definition" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_ledger_locales" ("aria_label", "_locale", "_parent_id")
    SELECT "aria_label", 'en', "id" FROM "v9_slate_blocks_ledger" WHERE "aria_label" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_archival_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_slate_blocks_archival" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_division_strip_divisions_locales" ("blurb", "_locale", "_parent_id")
    SELECT "blurb", 'en', "id" FROM "v9_slate_blocks_division_strip_divisions" WHERE "blurb" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_mood_grid_items_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_slate_blocks_mood_grid_items" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_mood_grid_locales" ("aria_label", "scene_slug", "heading", "_locale", "_parent_id")
    SELECT "aria_label", "scene_slug", "heading", 'en', "id" FROM "v9_slate_blocks_mood_grid" WHERE "aria_label" IS NOT NULL OR "scene_slug" IS NOT NULL OR "heading" IS NOT NULL;
  INSERT INTO "v9_slate_blocks_founding_roll_locales" ("scene_slug", "heading", "body", "submit_label", "success_note", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "submit_label", "success_note", 'en', "id" FROM "v9_slate_blocks_founding_roll" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "submit_label" IS NOT NULL OR "success_note" IS NOT NULL;
  INSERT INTO "v9_slate_locales" ("seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "seo_title", "seo_description", 'en', "id" FROM "v9_slate" WHERE "seo_title" IS NOT NULL OR "seo_description" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_photo_fold_locales" ("kicker", "heading", "caption", "credit", "_locale", "_parent_id")
    SELECT "kicker", "heading", "caption", "credit", 'en', "id" FROM "v9_craft_blocks_photo_fold" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_route_line_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "v9_craft_blocks_route_line_links" WHERE "label" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_text_fold_locales" ("scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", 'en', "id" FROM "v9_craft_blocks_text_fold" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL OR "quote" IS NOT NULL OR "cite" IS NOT NULL OR "more_label" IS NOT NULL OR "link_label" IS NOT NULL OR "aria_label" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_quote_feature_locales" ("quote", "cite", "note", "_locale", "_parent_id")
    SELECT "quote", "cite", "note", 'en', "id" FROM "v9_craft_blocks_quote_feature" WHERE "quote" IS NOT NULL OR "cite" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_slate_list_rows_locales" ("logline", "provenance", "_locale", "_parent_id")
    SELECT "logline", "provenance", 'en', "id" FROM "v9_craft_blocks_slate_list_rows" WHERE "logline" IS NOT NULL OR "provenance" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_footnote_locales" ("body", "_locale", "_parent_id")
    SELECT "body", 'en', "id" FROM "v9_craft_blocks_footnote" WHERE "body" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_request_locales" ("scene_slug", "heading", "body", "link_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "link_label", 'en', "id" FROM "v9_craft_blocks_request" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_ledger_rows_locales" ("term", "definition", "_locale", "_parent_id")
    SELECT "term", "definition", 'en', "id" FROM "v9_craft_blocks_ledger_rows" WHERE "term" IS NOT NULL OR "definition" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_ledger_locales" ("aria_label", "_locale", "_parent_id")
    SELECT "aria_label", 'en', "id" FROM "v9_craft_blocks_ledger" WHERE "aria_label" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_archival_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_craft_blocks_archival" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_division_strip_divisions_locales" ("blurb", "_locale", "_parent_id")
    SELECT "blurb", 'en', "id" FROM "v9_craft_blocks_division_strip_divisions" WHERE "blurb" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_mood_grid_items_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_craft_blocks_mood_grid_items" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_mood_grid_locales" ("aria_label", "scene_slug", "heading", "_locale", "_parent_id")
    SELECT "aria_label", "scene_slug", "heading", 'en', "id" FROM "v9_craft_blocks_mood_grid" WHERE "aria_label" IS NOT NULL OR "scene_slug" IS NOT NULL OR "heading" IS NOT NULL;
  INSERT INTO "v9_craft_blocks_founding_roll_locales" ("scene_slug", "heading", "body", "submit_label", "success_note", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "submit_label", "success_note", 'en', "id" FROM "v9_craft_blocks_founding_roll" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "submit_label" IS NOT NULL OR "success_note" IS NOT NULL;
  INSERT INTO "v9_craft_locales" ("seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "seo_title", "seo_description", 'en', "id" FROM "v9_craft" WHERE "seo_title" IS NOT NULL OR "seo_description" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_photo_fold_locales" ("kicker", "heading", "caption", "credit", "_locale", "_parent_id")
    SELECT "kicker", "heading", "caption", "credit", 'en', "id" FROM "v9_methods_blocks_photo_fold" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_route_line_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "v9_methods_blocks_route_line_links" WHERE "label" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_text_fold_locales" ("scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", 'en', "id" FROM "v9_methods_blocks_text_fold" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL OR "quote" IS NOT NULL OR "cite" IS NOT NULL OR "more_label" IS NOT NULL OR "link_label" IS NOT NULL OR "aria_label" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_quote_feature_locales" ("quote", "cite", "note", "_locale", "_parent_id")
    SELECT "quote", "cite", "note", 'en', "id" FROM "v9_methods_blocks_quote_feature" WHERE "quote" IS NOT NULL OR "cite" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_slate_list_rows_locales" ("logline", "provenance", "_locale", "_parent_id")
    SELECT "logline", "provenance", 'en', "id" FROM "v9_methods_blocks_slate_list_rows" WHERE "logline" IS NOT NULL OR "provenance" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_footnote_locales" ("body", "_locale", "_parent_id")
    SELECT "body", 'en', "id" FROM "v9_methods_blocks_footnote" WHERE "body" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_request_locales" ("scene_slug", "heading", "body", "link_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "link_label", 'en', "id" FROM "v9_methods_blocks_request" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_ledger_rows_locales" ("term", "definition", "_locale", "_parent_id")
    SELECT "term", "definition", 'en', "id" FROM "v9_methods_blocks_ledger_rows" WHERE "term" IS NOT NULL OR "definition" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_ledger_locales" ("aria_label", "_locale", "_parent_id")
    SELECT "aria_label", 'en', "id" FROM "v9_methods_blocks_ledger" WHERE "aria_label" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_archival_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_methods_blocks_archival" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_division_strip_divisions_locales" ("blurb", "_locale", "_parent_id")
    SELECT "blurb", 'en', "id" FROM "v9_methods_blocks_division_strip_divisions" WHERE "blurb" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_mood_grid_items_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_methods_blocks_mood_grid_items" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_mood_grid_locales" ("aria_label", "scene_slug", "heading", "_locale", "_parent_id")
    SELECT "aria_label", "scene_slug", "heading", 'en', "id" FROM "v9_methods_blocks_mood_grid" WHERE "aria_label" IS NOT NULL OR "scene_slug" IS NOT NULL OR "heading" IS NOT NULL;
  INSERT INTO "v9_methods_blocks_founding_roll_locales" ("scene_slug", "heading", "body", "submit_label", "success_note", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "submit_label", "success_note", 'en', "id" FROM "v9_methods_blocks_founding_roll" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "submit_label" IS NOT NULL OR "success_note" IS NOT NULL;
  INSERT INTO "v9_methods_locales" ("seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "seo_title", "seo_description", 'en', "id" FROM "v9_methods" WHERE "seo_title" IS NOT NULL OR "seo_description" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_photo_fold_locales" ("kicker", "heading", "caption", "credit", "_locale", "_parent_id")
    SELECT "kicker", "heading", "caption", "credit", 'en', "id" FROM "v9_contact_blocks_photo_fold" WHERE "kicker" IS NOT NULL OR "heading" IS NOT NULL OR "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_route_line_links_locales" ("label", "_locale", "_parent_id")
    SELECT COALESCE("label", ''), 'en', "id" FROM "v9_contact_blocks_route_line_links" WHERE "label" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_text_fold_locales" ("scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "lede", "body", "quote", "cite", "more_label", "link_label", "aria_label", 'en', "id" FROM "v9_contact_blocks_text_fold" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "lede" IS NOT NULL OR "body" IS NOT NULL OR "quote" IS NOT NULL OR "cite" IS NOT NULL OR "more_label" IS NOT NULL OR "link_label" IS NOT NULL OR "aria_label" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_quote_feature_locales" ("quote", "cite", "note", "_locale", "_parent_id")
    SELECT "quote", "cite", "note", 'en', "id" FROM "v9_contact_blocks_quote_feature" WHERE "quote" IS NOT NULL OR "cite" IS NOT NULL OR "note" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_slate_list_rows_locales" ("logline", "provenance", "_locale", "_parent_id")
    SELECT "logline", "provenance", 'en', "id" FROM "v9_contact_blocks_slate_list_rows" WHERE "logline" IS NOT NULL OR "provenance" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_footnote_locales" ("body", "_locale", "_parent_id")
    SELECT "body", 'en', "id" FROM "v9_contact_blocks_footnote" WHERE "body" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_request_locales" ("scene_slug", "heading", "body", "link_label", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "link_label", 'en', "id" FROM "v9_contact_blocks_request" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "link_label" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_ledger_rows_locales" ("term", "definition", "_locale", "_parent_id")
    SELECT "term", "definition", 'en', "id" FROM "v9_contact_blocks_ledger_rows" WHERE "term" IS NOT NULL OR "definition" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_ledger_locales" ("aria_label", "_locale", "_parent_id")
    SELECT "aria_label", 'en', "id" FROM "v9_contact_blocks_ledger" WHERE "aria_label" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_archival_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_contact_blocks_archival" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_division_strip_divisions_locales" ("blurb", "_locale", "_parent_id")
    SELECT "blurb", 'en', "id" FROM "v9_contact_blocks_division_strip_divisions" WHERE "blurb" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_mood_grid_items_locales" ("caption", "credit", "_locale", "_parent_id")
    SELECT "caption", "credit", 'en', "id" FROM "v9_contact_blocks_mood_grid_items" WHERE "caption" IS NOT NULL OR "credit" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_mood_grid_locales" ("aria_label", "scene_slug", "heading", "_locale", "_parent_id")
    SELECT "aria_label", "scene_slug", "heading", 'en', "id" FROM "v9_contact_blocks_mood_grid" WHERE "aria_label" IS NOT NULL OR "scene_slug" IS NOT NULL OR "heading" IS NOT NULL;
  INSERT INTO "v9_contact_blocks_founding_roll_locales" ("scene_slug", "heading", "body", "submit_label", "success_note", "_locale", "_parent_id")
    SELECT "scene_slug", "heading", "body", "submit_label", "success_note", 'en', "id" FROM "v9_contact_blocks_founding_roll" WHERE "scene_slug" IS NOT NULL OR "heading" IS NOT NULL OR "body" IS NOT NULL OR "submit_label" IS NOT NULL OR "success_note" IS NOT NULL;
  INSERT INTO "v9_contact_locales" ("seo_title", "seo_description", "_locale", "_parent_id")
    SELECT "seo_title", "seo_description", 'en', "id" FROM "v9_contact" WHERE "seo_title" IS NOT NULL OR "seo_description" IS NOT NULL;
`)

  // 3. only now are the old single-locale columns removed.
  await db.execute(sql`
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "projects_gallery" DROP COLUMN "caption";
  ALTER TABLE "projects_gallery" DROP COLUMN "credit";
  ALTER TABLE "projects_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "projects_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "projects_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "projects_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "projects_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "projects_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "projects_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "projects_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "projects_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "projects_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "projects_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "projects_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "projects_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "projects_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "projects_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "projects_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "projects_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "projects_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "projects_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "projects_blocks_zine_synopsis" DROP COLUMN "kicker";
  ALTER TABLE "projects_blocks_zine_synopsis" DROP COLUMN "logline";
  ALTER TABLE "projects_blocks_zine_synopsis" DROP COLUMN "body";
  ALTER TABLE "projects_blocks_zine_synopsis" DROP COLUMN "note";
  ALTER TABLE "projects" DROP COLUMN "subtitle";
  ALTER TABLE "projects" DROP COLUMN "logline";
  ALTER TABLE "projects" DROP COLUMN "short_logline";
  ALTER TABLE "projects" DROP COLUMN "provenance";
  ALTER TABLE "projects" DROP COLUMN "meta_line";
  ALTER TABLE "projects" DROP COLUMN "body_prose";
  ALTER TABLE "projects" DROP COLUMN "page_quote_quote";
  ALTER TABLE "projects" DROP COLUMN "page_quote_cite";
  ALTER TABLE "projects" DROP COLUMN "page_quote_note";
  ALTER TABLE "projects" DROP COLUMN "hero_caption";
  ALTER TABLE "projects" DROP COLUMN "hero_credit";
  ALTER TABLE "projects" DROP COLUMN "request_body";
  ALTER TABLE "projects" DROP COLUMN "synopsis";
  ALTER TABLE "projects" DROP COLUMN "pitch_deck_note";
  ALTER TABLE "news_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "news_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "news_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "news_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "news_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "news_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "news_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "news_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "news_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "news_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "news_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "news_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "news_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "news_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "news_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "news_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "news_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "news_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "news_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "news" DROP COLUMN "title";
  ALTER TABLE "news" DROP COLUMN "deck";
  ALTER TABLE "dispatch_issues_cover_lines" DROP COLUMN "text";
  ALTER TABLE "dispatch_issues_cover_coverlines" DROP COLUMN "head";
  ALTER TABLE "dispatch_issues_cover_coverlines" DROP COLUMN "deck";
  ALTER TABLE "dispatch_issues_contents_entries" DROP COLUMN "title";
  ALTER TABLE "dispatch_issues_contents_entries" DROP COLUMN "deck";
  ALTER TABLE "dispatch_issues_contents_entries" DROP COLUMN "by";
  ALTER TABLE "dispatch_issues_contents" DROP COLUMN "label";
  ALTER TABLE "dispatch_issues_contents" DROP COLUMN "meta";
  ALTER TABLE "dispatch_issues_editorial_paragraphs" DROP COLUMN "text";
  ALTER TABLE "dispatch_issues_feature_title_parts" DROP COLUMN "text";
  ALTER TABLE "dispatch_issues_feature_meta" DROP COLUMN "value";
  ALTER TABLE "dispatch_issues_feature_paragraphs" DROP COLUMN "text";
  ALTER TABLE "dispatch_issues_feature_paragraphs" DROP COLUMN "attr";
  ALTER TABLE "dispatch_issues_feature_factbox_fields" DROP COLUMN "value";
  ALTER TABLE "dispatch_issues_feature_related" DROP COLUMN "meta";
  ALTER TABLE "dispatch_issues_dispatches" DROP COLUMN "date";
  ALTER TABLE "dispatch_issues_dispatches" DROP COLUMN "title";
  ALTER TABLE "dispatch_issues_dispatches" DROP COLUMN "body";
  ALTER TABLE "dispatch_issues_dispatches" DROP COLUMN "status";
  ALTER TABLE "dispatch_issues_dispatches" DROP COLUMN "ghost";
  ALTER TABLE "dispatch_issues_trades" DROP COLUMN "city";
  ALTER TABLE "dispatch_issues_trades" DROP COLUMN "headline";
  ALTER TABLE "dispatch_issues_trades" DROP COLUMN "deck";
  ALTER TABLE "dispatch_issues_trades" DROP COLUMN "attr";
  ALTER TABLE "dispatch_issues_calendar" DROP COLUMN "date";
  ALTER TABLE "dispatch_issues_calendar" DROP COLUMN "title";
  ALTER TABLE "dispatch_issues_calendar" DROP COLUMN "sub";
  ALTER TABLE "dispatch_issues_calendar" DROP COLUMN "tag";
  ALTER TABLE "dispatch_issues_classifieds" DROP COLUMN "cat";
  ALTER TABLE "dispatch_issues_classifieds" DROP COLUMN "title";
  ALTER TABLE "dispatch_issues_classifieds" DROP COLUMN "body";
  ALTER TABLE "dispatch_issues_classifieds" DROP COLUMN "meta";
  ALTER TABLE "dispatch_issues_archive" DROP COLUMN "season";
  ALTER TABLE "dispatch_issues_archive" DROP COLUMN "line";
  ALTER TABLE "dispatch_issues_archive" DROP COLUMN "state";
  ALTER TABLE "dispatch_issues" DROP COLUMN "display_title";
  ALTER TABLE "dispatch_issues" DROP COLUMN "indicia_season";
  ALTER TABLE "dispatch_issues" DROP COLUMN "indicia_print_run";
  ALTER TABLE "dispatch_issues" DROP COLUMN "indicia_offices";
  ALTER TABLE "dispatch_issues" DROP COLUMN "indicia_tagline";
  ALTER TABLE "dispatch_issues" DROP COLUMN "cover_kicker";
  ALTER TABLE "dispatch_issues" DROP COLUMN "cover_deck";
  ALTER TABLE "dispatch_issues" DROP COLUMN "cover_byline";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_eyebrow";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_title";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_lead";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_signature_name";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_signature_meta";
  ALTER TABLE "dispatch_issues" DROP COLUMN "editorial_quote";
  ALTER TABLE "dispatch_issues" DROP COLUMN "feature_eyebrow";
  ALTER TABLE "dispatch_issues" DROP COLUMN "feature_deck";
  ALTER TABLE "dispatch_issues" DROP COLUMN "feature_image_caption_caption";
  ALTER TABLE "dispatch_issues" DROP COLUMN "feature_image_caption_credit";
  ALTER TABLE "dispatch_issues" DROP COLUMN "feature_factbox_label";
  ALTER TABLE "dispatch_issues" DROP COLUMN "colophon_legal";
  ALTER TABLE "dispatch_issues" DROP COLUMN "colophon_type";
  ALTER TABLE "dispatch_issues" DROP COLUMN "colophon_baseline";
  ALTER TABLE "home_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "home_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "home_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "home_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "home_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "home_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "home_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "home_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "home_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "home_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "home_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "home_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "home_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "home_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "home_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "home_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "home_blocks_zine_masthead" DROP COLUMN "offices_line";
  ALTER TABLE "home_blocks_zine_masthead" DROP COLUMN "issue_label";
  ALTER TABLE "home_blocks_zine_masthead" DROP COLUMN "dek";
  ALTER TABLE "home_blocks_zine_passage_links" DROP COLUMN "label";
  ALTER TABLE "home_blocks_zine_passage" DROP COLUMN "kicker";
  ALTER TABLE "home_blocks_zine_passage" DROP COLUMN "heading";
  ALTER TABLE "home_blocks_zine_passage" DROP COLUMN "lede";
  ALTER TABLE "home_blocks_zine_passage" DROP COLUMN "body";
  ALTER TABLE "site_settings_v9_chrome_nav_links" DROP COLUMN "label";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "ai_mark_text";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_display_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_panel_title";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_theme_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_theme_premiere";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_theme_matinee";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_theme_lateshow";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_scale_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_logo_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_top_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_prev_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_next_label";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_slate_return";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_cta";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_colophon";
  ALTER TABLE "site_settings" DROP COLUMN "v9_chrome_copyright";
  ALTER TABLE "site_settings" DROP COLUMN "dispatch_nav_label";
  ALTER TABLE "site_settings" DROP COLUMN "troupe_nav_label";
  ALTER TABLE "footer_links_primary_nav" DROP COLUMN "label";
  ALTER TABLE "footer_links_division_nav" DROP COLUMN "label";
  ALTER TABLE "footer_links_more_nav" DROP COLUMN "label";
  ALTER TABLE "about_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "about_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "about_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "about_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "about_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "about_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "about_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "about_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "about_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "about_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "about_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "about_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "about_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "about_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "about_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "about_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "about_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "about_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "about_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "contact_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "contact_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "contact_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "contact_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "contact_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "contact_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "contact_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "contact_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "contact_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "contact_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "contact_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "contact_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "contact_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "contact_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "contact_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "contact_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "contact_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "contact_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "contact_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "jobs_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "jobs_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "jobs_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "jobs_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "jobs_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "jobs_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "jobs_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "jobs_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "jobs_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "jobs_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "jobs_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "jobs_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "jobs_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "jobs_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "jobs_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "jobs_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "jobs_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "jobs_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "jobs_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "pitch_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "pitch_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "pitch_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "pitch_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "pitch_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "pitch_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "pitch_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "pitch_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "pitch_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "pitch_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "pitch_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "pitch_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "pitch_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "pitch_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "pitch_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "pitch_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "pitch_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "pitch_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "pitch_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "investors_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "investors_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "investors_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "investors_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "investors_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "investors_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "investors_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "investors_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "investors_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "investors_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "investors_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "investors_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "investors_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "investors_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "investors_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "investors_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "investors_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "investors_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "investors_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "212_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "212_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "212_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "212_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "212_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "212_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "212_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "212_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "212_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "212_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "212_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "212_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "212_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "212_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "212_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "212_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "212_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "212_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "212_blocks_zine_passage_links" DROP COLUMN "label";
  ALTER TABLE "212_blocks_zine_passage" DROP COLUMN "kicker";
  ALTER TABLE "212_blocks_zine_passage" DROP COLUMN "heading";
  ALTER TABLE "212_blocks_zine_passage" DROP COLUMN "lede";
  ALTER TABLE "212_blocks_zine_passage" DROP COLUMN "body";
  ALTER TABLE "310_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "310_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "310_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "310_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "310_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "310_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "310_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "310_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "310_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "310_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "310_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "310_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "310_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "310_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "310_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "310_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "310_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "310_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "310_blocks_zine_passage_links" DROP COLUMN "label";
  ALTER TABLE "310_blocks_zine_passage" DROP COLUMN "kicker";
  ALTER TABLE "310_blocks_zine_passage" DROP COLUMN "heading";
  ALTER TABLE "310_blocks_zine_passage" DROP COLUMN "lede";
  ALTER TABLE "310_blocks_zine_passage" DROP COLUMN "body";
  ALTER TABLE "nrc_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "nrc_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "nrc_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "nrc_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "nrc_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "nrc_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "nrc_blocks_grid_items" DROP COLUMN "title";
  ALTER TABLE "nrc_blocks_grid_items" DROP COLUMN "description";
  ALTER TABLE "nrc_blocks_grid" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "nrc_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "nrc_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "nrc_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "nrc_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_filmstrip_tiles" DROP COLUMN "caption";
  ALTER TABLE "nrc_blocks_division_showcase_divisions" DROP COLUMN "subtitle";
  ALTER TABLE "nrc_blocks_division_showcase_divisions" DROP COLUMN "description";
  ALTER TABLE "nrc_blocks_division_showcase" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_division_showcase" DROP COLUMN "subtext";
  ALTER TABLE "nrc_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "nrc_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "nrc_blocks_zine_passage_links" DROP COLUMN "label";
  ALTER TABLE "nrc_blocks_zine_passage" DROP COLUMN "kicker";
  ALTER TABLE "nrc_blocks_zine_passage" DROP COLUMN "heading";
  ALTER TABLE "nrc_blocks_zine_passage" DROP COLUMN "lede";
  ALTER TABLE "nrc_blocks_zine_passage" DROP COLUMN "body";
  ALTER TABLE "troupe_blocks_hero_slider_items" DROP COLUMN "title";
  ALTER TABLE "troupe_blocks_hero_slider_items" DROP COLUMN "subtext";
  ALTER TABLE "troupe_blocks_hero" DROP COLUMN "heading";
  ALTER TABLE "troupe_blocks_hero" DROP COLUMN "subtext";
  ALTER TABLE "troupe_blocks_playbill_voices" DROP COLUMN "voice";
  ALTER TABLE "troupe_blocks_playbill_voices" DROP COLUMN "descriptor";
  ALTER TABLE "troupe_blocks_playbill_voices" DROP COLUMN "roles";
  ALTER TABLE "troupe_blocks_playbill_voices" DROP COLUMN "note";
  ALTER TABLE "troupe_blocks_playbill" DROP COLUMN "program_number";
  ALTER TABLE "troupe_blocks_playbill" DROP COLUMN "subtitle";
  ALTER TABLE "troupe_blocks_playbill" DROP COLUMN "runtime";
  ALTER TABLE "troupe_blocks_playbill" DROP COLUMN "notes";
  ALTER TABLE "troupe_blocks_rich_text" DROP COLUMN "content";
  ALTER TABLE "troupe_blocks_two_col" DROP COLUMN "left_heading";
  ALTER TABLE "troupe_blocks_two_col" DROP COLUMN "right_body";
  ALTER TABLE "troupe_blocks_cta_buttons" DROP COLUMN "label";
  ALTER TABLE "troupe_blocks_cta" DROP COLUMN "heading";
  ALTER TABLE "troupe_blocks_cta" DROP COLUMN "subtext";
  ALTER TABLE "troupe_blocks_quotes_quotes" DROP COLUMN "quote";
  ALTER TABLE "troupe_blocks_quotes_quotes" DROP COLUMN "attribution";
  ALTER TABLE "troupe_blocks_quotes" DROP COLUMN "heading";
  ALTER TABLE "troupe_blocks_stats_stats" DROP COLUMN "label";
  ALTER TABLE "troupe_blocks_stats" DROP COLUMN "heading";
  ALTER TABLE "troupe_blocks_divider" DROP COLUMN "label";
  ALTER TABLE "troupe_program_cast" DROP COLUMN "role";
  ALTER TABLE "troupe_program" DROP COLUMN "subtitle";
  ALTER TABLE "troupe_program" DROP COLUMN "logline";
  ALTER TABLE "troupe_program" DROP COLUMN "programme_note";
  ALTER TABLE "troupe_program" DROP COLUMN "credits";
  ALTER TABLE "v9_home_blocks_photo_fold" DROP COLUMN "kicker";
  ALTER TABLE "v9_home_blocks_photo_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_home_blocks_photo_fold" DROP COLUMN "caption";
  ALTER TABLE "v9_home_blocks_photo_fold" DROP COLUMN "credit";
  ALTER TABLE "v9_home_blocks_route_line_links" DROP COLUMN "label";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "lede";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "body";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "quote";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "cite";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "more_label";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "link_label";
  ALTER TABLE "v9_home_blocks_text_fold" DROP COLUMN "aria_label";
  ALTER TABLE "v9_home_blocks_quote_feature" DROP COLUMN "quote";
  ALTER TABLE "v9_home_blocks_quote_feature" DROP COLUMN "cite";
  ALTER TABLE "v9_home_blocks_quote_feature" DROP COLUMN "note";
  ALTER TABLE "v9_home_blocks_slate_list_rows" DROP COLUMN "logline";
  ALTER TABLE "v9_home_blocks_slate_list_rows" DROP COLUMN "provenance";
  ALTER TABLE "v9_home_blocks_footnote" DROP COLUMN "body";
  ALTER TABLE "v9_home_blocks_request" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_home_blocks_request" DROP COLUMN "heading";
  ALTER TABLE "v9_home_blocks_request" DROP COLUMN "body";
  ALTER TABLE "v9_home_blocks_request" DROP COLUMN "link_label";
  ALTER TABLE "v9_home_blocks_ledger_rows" DROP COLUMN "term";
  ALTER TABLE "v9_home_blocks_ledger_rows" DROP COLUMN "definition";
  ALTER TABLE "v9_home_blocks_ledger" DROP COLUMN "aria_label";
  ALTER TABLE "v9_home_blocks_archival" DROP COLUMN "caption";
  ALTER TABLE "v9_home_blocks_archival" DROP COLUMN "credit";
  ALTER TABLE "v9_home_blocks_division_strip_divisions" DROP COLUMN "blurb";
  ALTER TABLE "v9_home_blocks_mood_grid_items" DROP COLUMN "caption";
  ALTER TABLE "v9_home_blocks_mood_grid_items" DROP COLUMN "credit";
  ALTER TABLE "v9_home_blocks_mood_grid" DROP COLUMN "aria_label";
  ALTER TABLE "v9_home_blocks_mood_grid" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_home_blocks_mood_grid" DROP COLUMN "heading";
  ALTER TABLE "v9_home_blocks_founding_roll" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_home_blocks_founding_roll" DROP COLUMN "heading";
  ALTER TABLE "v9_home_blocks_founding_roll" DROP COLUMN "body";
  ALTER TABLE "v9_home_blocks_founding_roll" DROP COLUMN "submit_label";
  ALTER TABLE "v9_home_blocks_founding_roll" DROP COLUMN "success_note";
  ALTER TABLE "v9_home" DROP COLUMN "seo_title";
  ALTER TABLE "v9_home" DROP COLUMN "seo_description";
  ALTER TABLE "v9_slate_blocks_photo_fold" DROP COLUMN "kicker";
  ALTER TABLE "v9_slate_blocks_photo_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_slate_blocks_photo_fold" DROP COLUMN "caption";
  ALTER TABLE "v9_slate_blocks_photo_fold" DROP COLUMN "credit";
  ALTER TABLE "v9_slate_blocks_route_line_links" DROP COLUMN "label";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "lede";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "body";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "quote";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "cite";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "more_label";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "link_label";
  ALTER TABLE "v9_slate_blocks_text_fold" DROP COLUMN "aria_label";
  ALTER TABLE "v9_slate_blocks_quote_feature" DROP COLUMN "quote";
  ALTER TABLE "v9_slate_blocks_quote_feature" DROP COLUMN "cite";
  ALTER TABLE "v9_slate_blocks_quote_feature" DROP COLUMN "note";
  ALTER TABLE "v9_slate_blocks_slate_list_rows" DROP COLUMN "logline";
  ALTER TABLE "v9_slate_blocks_slate_list_rows" DROP COLUMN "provenance";
  ALTER TABLE "v9_slate_blocks_footnote" DROP COLUMN "body";
  ALTER TABLE "v9_slate_blocks_request" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_slate_blocks_request" DROP COLUMN "heading";
  ALTER TABLE "v9_slate_blocks_request" DROP COLUMN "body";
  ALTER TABLE "v9_slate_blocks_request" DROP COLUMN "link_label";
  ALTER TABLE "v9_slate_blocks_ledger_rows" DROP COLUMN "term";
  ALTER TABLE "v9_slate_blocks_ledger_rows" DROP COLUMN "definition";
  ALTER TABLE "v9_slate_blocks_ledger" DROP COLUMN "aria_label";
  ALTER TABLE "v9_slate_blocks_archival" DROP COLUMN "caption";
  ALTER TABLE "v9_slate_blocks_archival" DROP COLUMN "credit";
  ALTER TABLE "v9_slate_blocks_division_strip_divisions" DROP COLUMN "blurb";
  ALTER TABLE "v9_slate_blocks_mood_grid_items" DROP COLUMN "caption";
  ALTER TABLE "v9_slate_blocks_mood_grid_items" DROP COLUMN "credit";
  ALTER TABLE "v9_slate_blocks_mood_grid" DROP COLUMN "aria_label";
  ALTER TABLE "v9_slate_blocks_mood_grid" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_slate_blocks_mood_grid" DROP COLUMN "heading";
  ALTER TABLE "v9_slate_blocks_founding_roll" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_slate_blocks_founding_roll" DROP COLUMN "heading";
  ALTER TABLE "v9_slate_blocks_founding_roll" DROP COLUMN "body";
  ALTER TABLE "v9_slate_blocks_founding_roll" DROP COLUMN "submit_label";
  ALTER TABLE "v9_slate_blocks_founding_roll" DROP COLUMN "success_note";
  ALTER TABLE "v9_slate" DROP COLUMN "seo_title";
  ALTER TABLE "v9_slate" DROP COLUMN "seo_description";
  ALTER TABLE "v9_craft_blocks_photo_fold" DROP COLUMN "kicker";
  ALTER TABLE "v9_craft_blocks_photo_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_craft_blocks_photo_fold" DROP COLUMN "caption";
  ALTER TABLE "v9_craft_blocks_photo_fold" DROP COLUMN "credit";
  ALTER TABLE "v9_craft_blocks_route_line_links" DROP COLUMN "label";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "lede";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "body";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "quote";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "cite";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "more_label";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "link_label";
  ALTER TABLE "v9_craft_blocks_text_fold" DROP COLUMN "aria_label";
  ALTER TABLE "v9_craft_blocks_quote_feature" DROP COLUMN "quote";
  ALTER TABLE "v9_craft_blocks_quote_feature" DROP COLUMN "cite";
  ALTER TABLE "v9_craft_blocks_quote_feature" DROP COLUMN "note";
  ALTER TABLE "v9_craft_blocks_slate_list_rows" DROP COLUMN "logline";
  ALTER TABLE "v9_craft_blocks_slate_list_rows" DROP COLUMN "provenance";
  ALTER TABLE "v9_craft_blocks_footnote" DROP COLUMN "body";
  ALTER TABLE "v9_craft_blocks_request" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_craft_blocks_request" DROP COLUMN "heading";
  ALTER TABLE "v9_craft_blocks_request" DROP COLUMN "body";
  ALTER TABLE "v9_craft_blocks_request" DROP COLUMN "link_label";
  ALTER TABLE "v9_craft_blocks_ledger_rows" DROP COLUMN "term";
  ALTER TABLE "v9_craft_blocks_ledger_rows" DROP COLUMN "definition";
  ALTER TABLE "v9_craft_blocks_ledger" DROP COLUMN "aria_label";
  ALTER TABLE "v9_craft_blocks_archival" DROP COLUMN "caption";
  ALTER TABLE "v9_craft_blocks_archival" DROP COLUMN "credit";
  ALTER TABLE "v9_craft_blocks_division_strip_divisions" DROP COLUMN "blurb";
  ALTER TABLE "v9_craft_blocks_mood_grid_items" DROP COLUMN "caption";
  ALTER TABLE "v9_craft_blocks_mood_grid_items" DROP COLUMN "credit";
  ALTER TABLE "v9_craft_blocks_mood_grid" DROP COLUMN "aria_label";
  ALTER TABLE "v9_craft_blocks_mood_grid" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_craft_blocks_mood_grid" DROP COLUMN "heading";
  ALTER TABLE "v9_craft_blocks_founding_roll" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_craft_blocks_founding_roll" DROP COLUMN "heading";
  ALTER TABLE "v9_craft_blocks_founding_roll" DROP COLUMN "body";
  ALTER TABLE "v9_craft_blocks_founding_roll" DROP COLUMN "submit_label";
  ALTER TABLE "v9_craft_blocks_founding_roll" DROP COLUMN "success_note";
  ALTER TABLE "v9_craft" DROP COLUMN "seo_title";
  ALTER TABLE "v9_craft" DROP COLUMN "seo_description";
  ALTER TABLE "v9_methods_blocks_photo_fold" DROP COLUMN "kicker";
  ALTER TABLE "v9_methods_blocks_photo_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_methods_blocks_photo_fold" DROP COLUMN "caption";
  ALTER TABLE "v9_methods_blocks_photo_fold" DROP COLUMN "credit";
  ALTER TABLE "v9_methods_blocks_route_line_links" DROP COLUMN "label";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "lede";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "body";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "quote";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "cite";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "more_label";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "link_label";
  ALTER TABLE "v9_methods_blocks_text_fold" DROP COLUMN "aria_label";
  ALTER TABLE "v9_methods_blocks_quote_feature" DROP COLUMN "quote";
  ALTER TABLE "v9_methods_blocks_quote_feature" DROP COLUMN "cite";
  ALTER TABLE "v9_methods_blocks_quote_feature" DROP COLUMN "note";
  ALTER TABLE "v9_methods_blocks_slate_list_rows" DROP COLUMN "logline";
  ALTER TABLE "v9_methods_blocks_slate_list_rows" DROP COLUMN "provenance";
  ALTER TABLE "v9_methods_blocks_footnote" DROP COLUMN "body";
  ALTER TABLE "v9_methods_blocks_request" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_methods_blocks_request" DROP COLUMN "heading";
  ALTER TABLE "v9_methods_blocks_request" DROP COLUMN "body";
  ALTER TABLE "v9_methods_blocks_request" DROP COLUMN "link_label";
  ALTER TABLE "v9_methods_blocks_ledger_rows" DROP COLUMN "term";
  ALTER TABLE "v9_methods_blocks_ledger_rows" DROP COLUMN "definition";
  ALTER TABLE "v9_methods_blocks_ledger" DROP COLUMN "aria_label";
  ALTER TABLE "v9_methods_blocks_archival" DROP COLUMN "caption";
  ALTER TABLE "v9_methods_blocks_archival" DROP COLUMN "credit";
  ALTER TABLE "v9_methods_blocks_division_strip_divisions" DROP COLUMN "blurb";
  ALTER TABLE "v9_methods_blocks_mood_grid_items" DROP COLUMN "caption";
  ALTER TABLE "v9_methods_blocks_mood_grid_items" DROP COLUMN "credit";
  ALTER TABLE "v9_methods_blocks_mood_grid" DROP COLUMN "aria_label";
  ALTER TABLE "v9_methods_blocks_mood_grid" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_methods_blocks_mood_grid" DROP COLUMN "heading";
  ALTER TABLE "v9_methods_blocks_founding_roll" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_methods_blocks_founding_roll" DROP COLUMN "heading";
  ALTER TABLE "v9_methods_blocks_founding_roll" DROP COLUMN "body";
  ALTER TABLE "v9_methods_blocks_founding_roll" DROP COLUMN "submit_label";
  ALTER TABLE "v9_methods_blocks_founding_roll" DROP COLUMN "success_note";
  ALTER TABLE "v9_methods" DROP COLUMN "seo_title";
  ALTER TABLE "v9_methods" DROP COLUMN "seo_description";
  ALTER TABLE "v9_contact_blocks_photo_fold" DROP COLUMN "kicker";
  ALTER TABLE "v9_contact_blocks_photo_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_contact_blocks_photo_fold" DROP COLUMN "caption";
  ALTER TABLE "v9_contact_blocks_photo_fold" DROP COLUMN "credit";
  ALTER TABLE "v9_contact_blocks_route_line_links" DROP COLUMN "label";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "heading";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "lede";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "body";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "quote";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "cite";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "more_label";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "link_label";
  ALTER TABLE "v9_contact_blocks_text_fold" DROP COLUMN "aria_label";
  ALTER TABLE "v9_contact_blocks_quote_feature" DROP COLUMN "quote";
  ALTER TABLE "v9_contact_blocks_quote_feature" DROP COLUMN "cite";
  ALTER TABLE "v9_contact_blocks_quote_feature" DROP COLUMN "note";
  ALTER TABLE "v9_contact_blocks_slate_list_rows" DROP COLUMN "logline";
  ALTER TABLE "v9_contact_blocks_slate_list_rows" DROP COLUMN "provenance";
  ALTER TABLE "v9_contact_blocks_footnote" DROP COLUMN "body";
  ALTER TABLE "v9_contact_blocks_request" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_contact_blocks_request" DROP COLUMN "heading";
  ALTER TABLE "v9_contact_blocks_request" DROP COLUMN "body";
  ALTER TABLE "v9_contact_blocks_request" DROP COLUMN "link_label";
  ALTER TABLE "v9_contact_blocks_ledger_rows" DROP COLUMN "term";
  ALTER TABLE "v9_contact_blocks_ledger_rows" DROP COLUMN "definition";
  ALTER TABLE "v9_contact_blocks_ledger" DROP COLUMN "aria_label";
  ALTER TABLE "v9_contact_blocks_archival" DROP COLUMN "caption";
  ALTER TABLE "v9_contact_blocks_archival" DROP COLUMN "credit";
  ALTER TABLE "v9_contact_blocks_division_strip_divisions" DROP COLUMN "blurb";
  ALTER TABLE "v9_contact_blocks_mood_grid_items" DROP COLUMN "caption";
  ALTER TABLE "v9_contact_blocks_mood_grid_items" DROP COLUMN "credit";
  ALTER TABLE "v9_contact_blocks_mood_grid" DROP COLUMN "aria_label";
  ALTER TABLE "v9_contact_blocks_mood_grid" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_contact_blocks_mood_grid" DROP COLUMN "heading";
  ALTER TABLE "v9_contact_blocks_founding_roll" DROP COLUMN "scene_slug";
  ALTER TABLE "v9_contact_blocks_founding_roll" DROP COLUMN "heading";
  ALTER TABLE "v9_contact_blocks_founding_roll" DROP COLUMN "body";
  ALTER TABLE "v9_contact_blocks_founding_roll" DROP COLUMN "submit_label";
  ALTER TABLE "v9_contact_blocks_founding_roll" DROP COLUMN "success_note";
  ALTER TABLE "v9_contact" DROP COLUMN "seo_title";
  ALTER TABLE "v9_contact" DROP COLUMN "seo_description";
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "story_place";
  ALTER TABLE "projects" DROP COLUMN IF EXISTS "hero_line";
`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // 1. put the single-locale columns back (nullable or defaulted, so populated tables accept them).
  await db.execute(sql`
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_gallery" ADD COLUMN "caption" varchar;
  ALTER TABLE "projects_gallery" ADD COLUMN "credit" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "projects_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "projects_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "projects_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "projects_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "projects_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "projects_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "projects_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "projects_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "projects_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "projects_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "projects_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "projects_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "projects_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "projects_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "projects_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "projects_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "projects_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "projects_blocks_zine_synopsis" ADD COLUMN "kicker" varchar;
  ALTER TABLE "projects_blocks_zine_synopsis" ADD COLUMN "logline" varchar;
  ALTER TABLE "projects_blocks_zine_synopsis" ADD COLUMN "body" varchar NOT NULL DEFAULT '';
  ALTER TABLE "projects_blocks_zine_synopsis" ADD COLUMN "note" varchar;
  ALTER TABLE "projects" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "projects" ADD COLUMN "logline" varchar;
  ALTER TABLE "projects" ADD COLUMN "short_logline" varchar;
  ALTER TABLE "projects" ADD COLUMN "provenance" varchar;
  ALTER TABLE "projects" ADD COLUMN "meta_line" varchar;
  ALTER TABLE "projects" ADD COLUMN "body_prose" varchar;
  ALTER TABLE "projects" ADD COLUMN "page_quote_quote" varchar;
  ALTER TABLE "projects" ADD COLUMN "page_quote_cite" varchar;
  ALTER TABLE "projects" ADD COLUMN "page_quote_note" varchar;
  ALTER TABLE "projects" ADD COLUMN "hero_caption" varchar;
  ALTER TABLE "projects" ADD COLUMN "hero_credit" varchar;
  ALTER TABLE "projects" ADD COLUMN "request_body" varchar;
  ALTER TABLE "projects" ADD COLUMN "synopsis" varchar;
  ALTER TABLE "projects" ADD COLUMN "pitch_deck_note" varchar;
  ALTER TABLE "news_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "news_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "news_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "news_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "news_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "news_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "news_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "news_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "news_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "news_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "news_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "news_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "news_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "news_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "news_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "news_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "news_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "news_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "news" ADD COLUMN "title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "news" ADD COLUMN "deck" varchar;
  ALTER TABLE "dispatch_issues_cover_lines" ADD COLUMN "text" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_cover_coverlines" ADD COLUMN "head" varchar;
  ALTER TABLE "dispatch_issues_cover_coverlines" ADD COLUMN "deck" varchar;
  ALTER TABLE "dispatch_issues_contents_entries" ADD COLUMN "title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_contents_entries" ADD COLUMN "deck" varchar;
  ALTER TABLE "dispatch_issues_contents_entries" ADD COLUMN "by" varchar;
  ALTER TABLE "dispatch_issues_contents" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_contents" ADD COLUMN "meta" varchar;
  ALTER TABLE "dispatch_issues_editorial_paragraphs" ADD COLUMN "text" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_feature_title_parts" ADD COLUMN "text" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_feature_meta" ADD COLUMN "value" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_feature_paragraphs" ADD COLUMN "text" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_feature_paragraphs" ADD COLUMN "attr" varchar;
  ALTER TABLE "dispatch_issues_feature_factbox_fields" ADD COLUMN "value" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_feature_related" ADD COLUMN "meta" varchar;
  ALTER TABLE "dispatch_issues_dispatches" ADD COLUMN "date" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_dispatches" ADD COLUMN "title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_dispatches" ADD COLUMN "body" varchar;
  ALTER TABLE "dispatch_issues_dispatches" ADD COLUMN "status" varchar;
  ALTER TABLE "dispatch_issues_dispatches" ADD COLUMN "ghost" varchar;
  ALTER TABLE "dispatch_issues_trades" ADD COLUMN "city" varchar;
  ALTER TABLE "dispatch_issues_trades" ADD COLUMN "headline" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_trades" ADD COLUMN "deck" varchar;
  ALTER TABLE "dispatch_issues_trades" ADD COLUMN "attr" varchar;
  ALTER TABLE "dispatch_issues_calendar" ADD COLUMN "date" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_calendar" ADD COLUMN "title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_calendar" ADD COLUMN "sub" varchar;
  ALTER TABLE "dispatch_issues_calendar" ADD COLUMN "tag" varchar;
  ALTER TABLE "dispatch_issues_classifieds" ADD COLUMN "cat" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_classifieds" ADD COLUMN "title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues_classifieds" ADD COLUMN "body" varchar;
  ALTER TABLE "dispatch_issues_classifieds" ADD COLUMN "meta" varchar;
  ALTER TABLE "dispatch_issues_archive" ADD COLUMN "season" varchar;
  ALTER TABLE "dispatch_issues_archive" ADD COLUMN "line" varchar;
  ALTER TABLE "dispatch_issues_archive" ADD COLUMN "state" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "display_title" varchar NOT NULL DEFAULT '';
  ALTER TABLE "dispatch_issues" ADD COLUMN "indicia_season" varchar DEFAULT 'SPRING 2026' NOT NULL;
  ALTER TABLE "dispatch_issues" ADD COLUMN "indicia_print_run" varchar DEFAULT 'PRESSRUN 1,200';
  ALTER TABLE "dispatch_issues" ADD COLUMN "indicia_offices" varchar DEFAULT 'LIC NY 11101';
  ALTER TABLE "dispatch_issues" ADD COLUMN "indicia_tagline" varchar DEFAULT 'PRECISE. PURPOSEFUL. BUILT TO LAST.';
  ALTER TABLE "dispatch_issues" ADD COLUMN "cover_kicker" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "cover_deck" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "cover_byline" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_eyebrow" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_title" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_lead" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_signature_name" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_signature_meta" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "editorial_quote" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "feature_eyebrow" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "feature_deck" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "feature_image_caption_caption" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "feature_image_caption_credit" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "feature_factbox_label" varchar DEFAULT 'AT A GLANCE';
  ALTER TABLE "dispatch_issues" ADD COLUMN "colophon_legal" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "colophon_type" varchar;
  ALTER TABLE "dispatch_issues" ADD COLUMN "colophon_baseline" varchar;
  ALTER TABLE "home_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "home_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "home_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "home_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "home_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "home_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "home_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "home_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "home_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "home_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "home_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "home_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "home_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "home_blocks_zine_masthead" ADD COLUMN "offices_line" varchar;
  ALTER TABLE "home_blocks_zine_masthead" ADD COLUMN "issue_label" varchar;
  ALTER TABLE "home_blocks_zine_masthead" ADD COLUMN "dek" varchar;
  ALTER TABLE "home_blocks_zine_passage_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_zine_passage" ADD COLUMN "kicker" varchar;
  ALTER TABLE "home_blocks_zine_passage" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "home_blocks_zine_passage" ADD COLUMN "lede" varchar;
  ALTER TABLE "home_blocks_zine_passage" ADD COLUMN "body" varchar;
  ALTER TABLE "site_settings_v9_chrome_nav_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "ai_mark_text" varchar DEFAULT 'APR 70 · AI GEN';
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_display_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_panel_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_theme_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_theme_premiere" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_theme_matinee" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_theme_lateshow" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_scale_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_logo_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_top_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_prev_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_next_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_slate_return" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_cta" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_colophon" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "v9_chrome_copyright" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "dispatch_nav_label" varchar DEFAULT 'Dispatch';
  ALTER TABLE "site_settings" ADD COLUMN "troupe_nav_label" varchar DEFAULT 'Troupe';
  ALTER TABLE "footer_links_primary_nav" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "footer_links_division_nav" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "footer_links_more_nav" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "about_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "about_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "about_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "about_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "about_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "about_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "about_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "about_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "about_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "about_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "about_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "about_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "about_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "about_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "about_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "about_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "about_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "about_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "contact_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "contact_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "contact_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "contact_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "contact_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "contact_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "contact_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "contact_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "contact_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "contact_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "contact_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "contact_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "contact_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "contact_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "contact_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "contact_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "contact_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "contact_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "contact_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "jobs_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "jobs_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "jobs_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "jobs_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "jobs_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "jobs_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "jobs_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "jobs_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "jobs_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "jobs_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "jobs_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "jobs_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "jobs_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "jobs_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "jobs_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "jobs_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "jobs_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "jobs_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "jobs_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "pitch_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pitch_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pitch_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pitch_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "pitch_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "pitch_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "pitch_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "pitch_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "pitch_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pitch_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "pitch_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "pitch_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "pitch_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "pitch_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "pitch_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "pitch_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "pitch_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "pitch_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "pitch_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "investors_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "investors_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "investors_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "investors_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "investors_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "investors_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "investors_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "investors_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "investors_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "investors_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "investors_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "investors_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "investors_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "investors_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "investors_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "investors_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "investors_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "investors_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "investors_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "212_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "212_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "212_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "212_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "212_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "212_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "212_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "212_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "212_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "212_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "212_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "212_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "212_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "212_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "212_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "212_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "212_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "212_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "212_blocks_zine_passage_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_zine_passage" ADD COLUMN "kicker" varchar;
  ALTER TABLE "212_blocks_zine_passage" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "212_blocks_zine_passage" ADD COLUMN "lede" varchar;
  ALTER TABLE "212_blocks_zine_passage" ADD COLUMN "body" varchar;
  ALTER TABLE "310_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "310_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "310_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "310_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "310_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "310_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "310_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "310_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "310_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "310_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "310_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "310_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "310_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "310_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "310_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "310_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "310_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "310_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "310_blocks_zine_passage_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_zine_passage" ADD COLUMN "kicker" varchar;
  ALTER TABLE "310_blocks_zine_passage" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "310_blocks_zine_passage" ADD COLUMN "lede" varchar;
  ALTER TABLE "310_blocks_zine_passage" ADD COLUMN "body" varchar;
  ALTER TABLE "nrc_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "nrc_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "nrc_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "nrc_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "nrc_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "nrc_blocks_grid_items" ADD COLUMN "title" varchar;
  ALTER TABLE "nrc_blocks_grid_items" ADD COLUMN "description" jsonb;
  ALTER TABLE "nrc_blocks_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "nrc_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "nrc_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "nrc_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "nrc_blocks_filmstrip_tiles" ADD COLUMN "caption" varchar;
  ALTER TABLE "nrc_blocks_division_showcase_divisions" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "nrc_blocks_division_showcase_divisions" ADD COLUMN "description" varchar;
  ALTER TABLE "nrc_blocks_division_showcase" ADD COLUMN "heading" varchar;
  ALTER TABLE "nrc_blocks_division_showcase" ADD COLUMN "subtext" varchar;
  ALTER TABLE "nrc_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "nrc_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "nrc_blocks_zine_passage_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_zine_passage" ADD COLUMN "kicker" varchar;
  ALTER TABLE "nrc_blocks_zine_passage" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "nrc_blocks_zine_passage" ADD COLUMN "lede" varchar;
  ALTER TABLE "nrc_blocks_zine_passage" ADD COLUMN "body" varchar;
  ALTER TABLE "troupe_blocks_hero_slider_items" ADD COLUMN "title" varchar;
  ALTER TABLE "troupe_blocks_hero_slider_items" ADD COLUMN "subtext" varchar;
  ALTER TABLE "troupe_blocks_hero" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_hero" ADD COLUMN "subtext" varchar;
  ALTER TABLE "troupe_blocks_playbill_voices" ADD COLUMN "voice" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_playbill_voices" ADD COLUMN "descriptor" varchar;
  ALTER TABLE "troupe_blocks_playbill_voices" ADD COLUMN "roles" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_playbill_voices" ADD COLUMN "note" varchar;
  ALTER TABLE "troupe_blocks_playbill" ADD COLUMN "program_number" varchar;
  ALTER TABLE "troupe_blocks_playbill" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "troupe_blocks_playbill" ADD COLUMN "runtime" varchar;
  ALTER TABLE "troupe_blocks_playbill" ADD COLUMN "notes" varchar;
  ALTER TABLE "troupe_blocks_rich_text" ADD COLUMN "content" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "troupe_blocks_two_col" ADD COLUMN "left_heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_two_col" ADD COLUMN "right_body" jsonb NOT NULL DEFAULT '{}'::jsonb;
  ALTER TABLE "troupe_blocks_cta_buttons" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_cta" ADD COLUMN "heading" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_cta" ADD COLUMN "subtext" varchar;
  ALTER TABLE "troupe_blocks_quotes_quotes" ADD COLUMN "quote" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_quotes_quotes" ADD COLUMN "attribution" varchar;
  ALTER TABLE "troupe_blocks_quotes" ADD COLUMN "heading" varchar;
  ALTER TABLE "troupe_blocks_stats_stats" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "troupe_blocks_stats" ADD COLUMN "heading" varchar;
  ALTER TABLE "troupe_blocks_divider" ADD COLUMN "label" varchar;
  ALTER TABLE "troupe_program_cast" ADD COLUMN "role" varchar;
  ALTER TABLE "troupe_program" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "troupe_program" ADD COLUMN "logline" varchar;
  ALTER TABLE "troupe_program" ADD COLUMN "programme_note" varchar;
  ALTER TABLE "troupe_program" ADD COLUMN "credits" varchar;
  ALTER TABLE "v9_home_blocks_photo_fold" ADD COLUMN "kicker" varchar;
  ALTER TABLE "v9_home_blocks_photo_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_home_blocks_photo_fold" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_home_blocks_photo_fold" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_home_blocks_route_line_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "lede" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "more_label" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_home_blocks_text_fold" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_home_blocks_quote_feature" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_home_blocks_quote_feature" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_home_blocks_quote_feature" ADD COLUMN "note" varchar;
  ALTER TABLE "v9_home_blocks_slate_list_rows" ADD COLUMN "logline" varchar;
  ALTER TABLE "v9_home_blocks_slate_list_rows" ADD COLUMN "provenance" varchar;
  ALTER TABLE "v9_home_blocks_footnote" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_home_blocks_request" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_home_blocks_request" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_home_blocks_request" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_home_blocks_request" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_home_blocks_ledger_rows" ADD COLUMN "term" varchar;
  ALTER TABLE "v9_home_blocks_ledger_rows" ADD COLUMN "definition" varchar;
  ALTER TABLE "v9_home_blocks_ledger" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_home_blocks_archival" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_home_blocks_archival" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_home_blocks_division_strip_divisions" ADD COLUMN "blurb" varchar;
  ALTER TABLE "v9_home_blocks_mood_grid_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_home_blocks_mood_grid_items" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_home_blocks_mood_grid" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_home_blocks_mood_grid" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_home_blocks_mood_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_home_blocks_founding_roll" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_home_blocks_founding_roll" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_home_blocks_founding_roll" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_home_blocks_founding_roll" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "v9_home_blocks_founding_roll" ADD COLUMN "success_note" varchar;
  ALTER TABLE "v9_home" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "v9_home" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "v9_slate_blocks_photo_fold" ADD COLUMN "kicker" varchar;
  ALTER TABLE "v9_slate_blocks_photo_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_slate_blocks_photo_fold" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_slate_blocks_photo_fold" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_slate_blocks_route_line_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "lede" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "more_label" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_slate_blocks_text_fold" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_slate_blocks_quote_feature" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_slate_blocks_quote_feature" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_slate_blocks_quote_feature" ADD COLUMN "note" varchar;
  ALTER TABLE "v9_slate_blocks_slate_list_rows" ADD COLUMN "logline" varchar;
  ALTER TABLE "v9_slate_blocks_slate_list_rows" ADD COLUMN "provenance" varchar;
  ALTER TABLE "v9_slate_blocks_footnote" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_slate_blocks_request" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_slate_blocks_request" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_slate_blocks_request" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_slate_blocks_request" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_slate_blocks_ledger_rows" ADD COLUMN "term" varchar;
  ALTER TABLE "v9_slate_blocks_ledger_rows" ADD COLUMN "definition" varchar;
  ALTER TABLE "v9_slate_blocks_ledger" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_slate_blocks_archival" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_slate_blocks_archival" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_slate_blocks_division_strip_divisions" ADD COLUMN "blurb" varchar;
  ALTER TABLE "v9_slate_blocks_mood_grid_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_slate_blocks_mood_grid_items" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_slate_blocks_mood_grid" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_slate_blocks_mood_grid" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_slate_blocks_mood_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD COLUMN "success_note" varchar;
  ALTER TABLE "v9_slate" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "v9_slate" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "v9_craft_blocks_photo_fold" ADD COLUMN "kicker" varchar;
  ALTER TABLE "v9_craft_blocks_photo_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_craft_blocks_photo_fold" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_craft_blocks_photo_fold" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_craft_blocks_route_line_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "lede" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "more_label" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_craft_blocks_text_fold" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_craft_blocks_quote_feature" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_craft_blocks_quote_feature" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_craft_blocks_quote_feature" ADD COLUMN "note" varchar;
  ALTER TABLE "v9_craft_blocks_slate_list_rows" ADD COLUMN "logline" varchar;
  ALTER TABLE "v9_craft_blocks_slate_list_rows" ADD COLUMN "provenance" varchar;
  ALTER TABLE "v9_craft_blocks_footnote" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_craft_blocks_request" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_craft_blocks_request" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_craft_blocks_request" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_craft_blocks_request" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_craft_blocks_ledger_rows" ADD COLUMN "term" varchar;
  ALTER TABLE "v9_craft_blocks_ledger_rows" ADD COLUMN "definition" varchar;
  ALTER TABLE "v9_craft_blocks_ledger" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_craft_blocks_archival" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_craft_blocks_archival" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_craft_blocks_division_strip_divisions" ADD COLUMN "blurb" varchar;
  ALTER TABLE "v9_craft_blocks_mood_grid_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_craft_blocks_mood_grid_items" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_craft_blocks_mood_grid" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_craft_blocks_mood_grid" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_craft_blocks_mood_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD COLUMN "success_note" varchar;
  ALTER TABLE "v9_craft" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "v9_craft" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "v9_methods_blocks_photo_fold" ADD COLUMN "kicker" varchar;
  ALTER TABLE "v9_methods_blocks_photo_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_methods_blocks_photo_fold" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_methods_blocks_photo_fold" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_methods_blocks_route_line_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "lede" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "more_label" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_methods_blocks_text_fold" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_methods_blocks_quote_feature" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_methods_blocks_quote_feature" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_methods_blocks_quote_feature" ADD COLUMN "note" varchar;
  ALTER TABLE "v9_methods_blocks_slate_list_rows" ADD COLUMN "logline" varchar;
  ALTER TABLE "v9_methods_blocks_slate_list_rows" ADD COLUMN "provenance" varchar;
  ALTER TABLE "v9_methods_blocks_footnote" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_methods_blocks_request" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_methods_blocks_request" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_methods_blocks_request" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_methods_blocks_request" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_methods_blocks_ledger_rows" ADD COLUMN "term" varchar;
  ALTER TABLE "v9_methods_blocks_ledger_rows" ADD COLUMN "definition" varchar;
  ALTER TABLE "v9_methods_blocks_ledger" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_methods_blocks_archival" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_methods_blocks_archival" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_methods_blocks_division_strip_divisions" ADD COLUMN "blurb" varchar;
  ALTER TABLE "v9_methods_blocks_mood_grid_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_methods_blocks_mood_grid_items" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_methods_blocks_mood_grid" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_methods_blocks_mood_grid" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_methods_blocks_mood_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD COLUMN "success_note" varchar;
  ALTER TABLE "v9_methods" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "v9_methods" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "v9_contact_blocks_photo_fold" ADD COLUMN "kicker" varchar;
  ALTER TABLE "v9_contact_blocks_photo_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_contact_blocks_photo_fold" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_contact_blocks_photo_fold" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_contact_blocks_route_line_links" ADD COLUMN "label" varchar NOT NULL DEFAULT '';
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "lede" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "more_label" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_contact_blocks_text_fold" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_contact_blocks_quote_feature" ADD COLUMN "quote" varchar;
  ALTER TABLE "v9_contact_blocks_quote_feature" ADD COLUMN "cite" varchar;
  ALTER TABLE "v9_contact_blocks_quote_feature" ADD COLUMN "note" varchar;
  ALTER TABLE "v9_contact_blocks_slate_list_rows" ADD COLUMN "logline" varchar;
  ALTER TABLE "v9_contact_blocks_slate_list_rows" ADD COLUMN "provenance" varchar;
  ALTER TABLE "v9_contact_blocks_footnote" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_contact_blocks_request" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_contact_blocks_request" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_contact_blocks_request" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_contact_blocks_request" ADD COLUMN "link_label" varchar;
  ALTER TABLE "v9_contact_blocks_ledger_rows" ADD COLUMN "term" varchar;
  ALTER TABLE "v9_contact_blocks_ledger_rows" ADD COLUMN "definition" varchar;
  ALTER TABLE "v9_contact_blocks_ledger" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_contact_blocks_archival" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_contact_blocks_archival" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_contact_blocks_division_strip_divisions" ADD COLUMN "blurb" varchar;
  ALTER TABLE "v9_contact_blocks_mood_grid_items" ADD COLUMN "caption" varchar;
  ALTER TABLE "v9_contact_blocks_mood_grid_items" ADD COLUMN "credit" varchar;
  ALTER TABLE "v9_contact_blocks_mood_grid" ADD COLUMN "aria_label" varchar;
  ALTER TABLE "v9_contact_blocks_mood_grid" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_contact_blocks_mood_grid" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD COLUMN "scene_slug" varchar;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD COLUMN "heading" varchar;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD COLUMN "body" varchar;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD COLUMN "success_note" varchar;
  ALTER TABLE "v9_contact" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "v9_contact" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "projects" ADD COLUMN "story_place" varchar;
  ALTER TABLE "projects" ADD COLUMN "hero_line" varchar;
`)

  // 2. copy the English locale rows back into them, then release the temporary defaults.
  await db.execute(sql`
  UPDATE "media" AS t SET "alt" = l."alt" FROM "media_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_gallery" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "projects_gallery_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "projects_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "projects_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_rich_text" AS t SET "content" = l."content" FROM "projects_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "projects_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "projects_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_grid" AS t SET "heading" = l."heading" FROM "projects_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_cta_buttons" AS t SET "label" = l."label" FROM "projects_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "projects_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "projects_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_quotes" AS t SET "heading" = l."heading" FROM "projects_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "projects_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "projects_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "projects_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_stats_stats" AS t SET "label" = l."label" FROM "projects_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_stats" AS t SET "heading" = l."heading" FROM "projects_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_divider" AS t SET "label" = l."label" FROM "projects_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_blocks_zine_synopsis" AS t SET "kicker" = l."kicker", "logline" = l."logline", "body" = l."body", "note" = l."note" FROM "projects_blocks_zine_synopsis_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects" AS t SET "subtitle" = l."subtitle", "story_place" = l."story_place", "logline" = l."logline", "short_logline" = l."short_logline", "provenance" = l."provenance", "meta_line" = l."meta_line", "body_prose" = l."body_prose", "page_quote_quote" = l."page_quote_quote", "page_quote_cite" = l."page_quote_cite", "page_quote_note" = l."page_quote_note", "hero_line" = l."hero_line", "hero_caption" = l."hero_caption", "hero_credit" = l."hero_credit", "request_body" = l."request_body", "synopsis" = l."synopsis", "pitch_deck_note" = l."pitch_deck_note" FROM "projects_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "news_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "news_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_rich_text" AS t SET "content" = l."content" FROM "news_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "news_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "news_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_grid" AS t SET "heading" = l."heading" FROM "news_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_cta_buttons" AS t SET "label" = l."label" FROM "news_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "news_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "news_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_quotes" AS t SET "heading" = l."heading" FROM "news_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "news_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "news_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "news_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_stats_stats" AS t SET "label" = l."label" FROM "news_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_stats" AS t SET "heading" = l."heading" FROM "news_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news_blocks_divider" AS t SET "label" = l."label" FROM "news_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "news" AS t SET "title" = l."title", "deck" = l."deck" FROM "news_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_cover_lines" AS t SET "text" = l."text" FROM "dispatch_issues_cover_lines_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_cover_coverlines" AS t SET "head" = l."head", "deck" = l."deck" FROM "dispatch_issues_cover_coverlines_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_contents_entries" AS t SET "title" = l."title", "deck" = l."deck", "by" = l."by" FROM "dispatch_issues_contents_entries_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_contents" AS t SET "label" = l."label", "meta" = l."meta" FROM "dispatch_issues_contents_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_editorial_paragraphs" AS t SET "text" = l."text" FROM "dispatch_issues_editorial_paragraphs_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_feature_title_parts" AS t SET "text" = l."text" FROM "dispatch_issues_feature_title_parts_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_feature_meta" AS t SET "value" = l."value" FROM "dispatch_issues_feature_meta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_feature_paragraphs" AS t SET "text" = l."text", "attr" = l."attr" FROM "dispatch_issues_feature_paragraphs_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_feature_factbox_fields" AS t SET "value" = l."value" FROM "dispatch_issues_feature_factbox_fields_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_feature_related" AS t SET "meta" = l."meta" FROM "dispatch_issues_feature_related_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_dispatches" AS t SET "date" = l."date", "title" = l."title", "body" = l."body", "status" = l."status", "ghost" = l."ghost" FROM "dispatch_issues_dispatches_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_trades" AS t SET "city" = l."city", "headline" = l."headline", "deck" = l."deck", "attr" = l."attr" FROM "dispatch_issues_trades_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_calendar" AS t SET "date" = l."date", "title" = l."title", "sub" = l."sub", "tag" = l."tag" FROM "dispatch_issues_calendar_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_classifieds" AS t SET "cat" = l."cat", "title" = l."title", "body" = l."body", "meta" = l."meta" FROM "dispatch_issues_classifieds_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues_archive" AS t SET "season" = l."season", "line" = l."line", "state" = l."state" FROM "dispatch_issues_archive_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "dispatch_issues" AS t SET "display_title" = l."display_title", "indicia_season" = l."indicia_season", "indicia_print_run" = l."indicia_print_run", "indicia_offices" = l."indicia_offices", "indicia_tagline" = l."indicia_tagline", "cover_kicker" = l."cover_kicker", "cover_deck" = l."cover_deck", "cover_byline" = l."cover_byline", "editorial_eyebrow" = l."editorial_eyebrow", "editorial_title" = l."editorial_title", "editorial_lead" = l."editorial_lead", "editorial_signature_name" = l."editorial_signature_name", "editorial_signature_meta" = l."editorial_signature_meta", "editorial_quote" = l."editorial_quote", "feature_eyebrow" = l."feature_eyebrow", "feature_deck" = l."feature_deck", "feature_image_caption_caption" = l."feature_image_caption_caption", "feature_image_caption_credit" = l."feature_image_caption_credit", "feature_factbox_label" = l."feature_factbox_label", "colophon_legal" = l."colophon_legal", "colophon_type" = l."colophon_type", "colophon_baseline" = l."colophon_baseline" FROM "dispatch_issues_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "home_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "home_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_rich_text" AS t SET "content" = l."content" FROM "home_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "home_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "home_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_grid" AS t SET "heading" = l."heading" FROM "home_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_cta_buttons" AS t SET "label" = l."label" FROM "home_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "home_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "home_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_quotes" AS t SET "heading" = l."heading" FROM "home_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "home_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "home_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "home_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_stats_stats" AS t SET "label" = l."label" FROM "home_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_stats" AS t SET "heading" = l."heading" FROM "home_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_divider" AS t SET "label" = l."label" FROM "home_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_zine_masthead" AS t SET "offices_line" = l."offices_line", "issue_label" = l."issue_label", "dek" = l."dek" FROM "home_blocks_zine_masthead_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_zine_passage_links" AS t SET "label" = l."label" FROM "home_blocks_zine_passage_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "home_blocks_zine_passage" AS t SET "kicker" = l."kicker", "heading" = l."heading", "lede" = l."lede", "body" = l."body" FROM "home_blocks_zine_passage_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "site_settings_v9_chrome_nav_links" AS t SET "label" = l."label" FROM "site_settings_v9_chrome_nav_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "site_settings" AS t SET "tagline" = l."tagline", "ai_mark_text" = l."ai_mark_text", "v9_chrome_display_label" = l."v9_chrome_display_label", "v9_chrome_panel_title" = l."v9_chrome_panel_title", "v9_chrome_theme_label" = l."v9_chrome_theme_label", "v9_chrome_theme_premiere" = l."v9_chrome_theme_premiere", "v9_chrome_theme_matinee" = l."v9_chrome_theme_matinee", "v9_chrome_theme_lateshow" = l."v9_chrome_theme_lateshow", "v9_chrome_scale_label" = l."v9_chrome_scale_label", "v9_chrome_logo_label" = l."v9_chrome_logo_label", "v9_chrome_top_label" = l."v9_chrome_top_label", "v9_chrome_prev_label" = l."v9_chrome_prev_label", "v9_chrome_next_label" = l."v9_chrome_next_label", "v9_chrome_slate_return" = l."v9_chrome_slate_return", "v9_chrome_cta" = l."v9_chrome_cta", "v9_chrome_colophon" = l."v9_chrome_colophon", "v9_chrome_copyright" = l."v9_chrome_copyright", "dispatch_nav_label" = l."dispatch_nav_label", "troupe_nav_label" = l."troupe_nav_label" FROM "site_settings_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "footer_links_primary_nav" AS t SET "label" = l."label" FROM "footer_links_primary_nav_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "footer_links_division_nav" AS t SET "label" = l."label" FROM "footer_links_division_nav_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "footer_links_more_nav" AS t SET "label" = l."label" FROM "footer_links_more_nav_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "about_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "about_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_rich_text" AS t SET "content" = l."content" FROM "about_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "about_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "about_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_grid" AS t SET "heading" = l."heading" FROM "about_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_cta_buttons" AS t SET "label" = l."label" FROM "about_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "about_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "about_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_quotes" AS t SET "heading" = l."heading" FROM "about_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "about_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "about_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "about_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_stats_stats" AS t SET "label" = l."label" FROM "about_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_stats" AS t SET "heading" = l."heading" FROM "about_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "about_blocks_divider" AS t SET "label" = l."label" FROM "about_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "contact_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "contact_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_rich_text" AS t SET "content" = l."content" FROM "contact_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "contact_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "contact_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_grid" AS t SET "heading" = l."heading" FROM "contact_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_cta_buttons" AS t SET "label" = l."label" FROM "contact_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "contact_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "contact_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_quotes" AS t SET "heading" = l."heading" FROM "contact_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "contact_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "contact_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "contact_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_stats_stats" AS t SET "label" = l."label" FROM "contact_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_stats" AS t SET "heading" = l."heading" FROM "contact_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact_blocks_divider" AS t SET "label" = l."label" FROM "contact_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "jobs_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "jobs_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_rich_text" AS t SET "content" = l."content" FROM "jobs_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "jobs_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "jobs_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_grid" AS t SET "heading" = l."heading" FROM "jobs_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_cta_buttons" AS t SET "label" = l."label" FROM "jobs_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "jobs_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "jobs_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_quotes" AS t SET "heading" = l."heading" FROM "jobs_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "jobs_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "jobs_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "jobs_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_stats_stats" AS t SET "label" = l."label" FROM "jobs_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_stats" AS t SET "heading" = l."heading" FROM "jobs_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "jobs_blocks_divider" AS t SET "label" = l."label" FROM "jobs_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "pitch_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "pitch_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_rich_text" AS t SET "content" = l."content" FROM "pitch_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "pitch_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "pitch_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_grid" AS t SET "heading" = l."heading" FROM "pitch_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_cta_buttons" AS t SET "label" = l."label" FROM "pitch_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "pitch_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "pitch_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_quotes" AS t SET "heading" = l."heading" FROM "pitch_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "pitch_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "pitch_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "pitch_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_stats_stats" AS t SET "label" = l."label" FROM "pitch_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_stats" AS t SET "heading" = l."heading" FROM "pitch_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "pitch_blocks_divider" AS t SET "label" = l."label" FROM "pitch_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "investors_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "investors_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_rich_text" AS t SET "content" = l."content" FROM "investors_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "investors_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "investors_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_grid" AS t SET "heading" = l."heading" FROM "investors_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_cta_buttons" AS t SET "label" = l."label" FROM "investors_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "investors_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "investors_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_quotes" AS t SET "heading" = l."heading" FROM "investors_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "investors_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "investors_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "investors_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_stats_stats" AS t SET "label" = l."label" FROM "investors_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_stats" AS t SET "heading" = l."heading" FROM "investors_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "investors_blocks_divider" AS t SET "label" = l."label" FROM "investors_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "212_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "212_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_rich_text" AS t SET "content" = l."content" FROM "212_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "212_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "212_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_grid" AS t SET "heading" = l."heading" FROM "212_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_cta_buttons" AS t SET "label" = l."label" FROM "212_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "212_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "212_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_quotes" AS t SET "heading" = l."heading" FROM "212_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "212_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "212_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "212_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_stats_stats" AS t SET "label" = l."label" FROM "212_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_stats" AS t SET "heading" = l."heading" FROM "212_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_divider" AS t SET "label" = l."label" FROM "212_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_zine_passage_links" AS t SET "label" = l."label" FROM "212_blocks_zine_passage_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "212_blocks_zine_passage" AS t SET "kicker" = l."kicker", "heading" = l."heading", "lede" = l."lede", "body" = l."body" FROM "212_blocks_zine_passage_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "310_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "310_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_rich_text" AS t SET "content" = l."content" FROM "310_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "310_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "310_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_grid" AS t SET "heading" = l."heading" FROM "310_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_cta_buttons" AS t SET "label" = l."label" FROM "310_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "310_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "310_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_quotes" AS t SET "heading" = l."heading" FROM "310_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "310_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "310_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "310_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_stats_stats" AS t SET "label" = l."label" FROM "310_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_stats" AS t SET "heading" = l."heading" FROM "310_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_divider" AS t SET "label" = l."label" FROM "310_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_zine_passage_links" AS t SET "label" = l."label" FROM "310_blocks_zine_passage_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "310_blocks_zine_passage" AS t SET "kicker" = l."kicker", "heading" = l."heading", "lede" = l."lede", "body" = l."body" FROM "310_blocks_zine_passage_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "nrc_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "nrc_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_rich_text" AS t SET "content" = l."content" FROM "nrc_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "nrc_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_grid_items" AS t SET "title" = l."title", "description" = l."description" FROM "nrc_blocks_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_grid" AS t SET "heading" = l."heading" FROM "nrc_blocks_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_cta_buttons" AS t SET "label" = l."label" FROM "nrc_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "nrc_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "nrc_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_quotes" AS t SET "heading" = l."heading" FROM "nrc_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_filmstrip_tiles" AS t SET "caption" = l."caption" FROM "nrc_blocks_filmstrip_tiles_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_division_showcase_divisions" AS t SET "subtitle" = l."subtitle", "description" = l."description" FROM "nrc_blocks_division_showcase_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_division_showcase" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "nrc_blocks_division_showcase_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_stats_stats" AS t SET "label" = l."label" FROM "nrc_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_stats" AS t SET "heading" = l."heading" FROM "nrc_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_divider" AS t SET "label" = l."label" FROM "nrc_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_zine_passage_links" AS t SET "label" = l."label" FROM "nrc_blocks_zine_passage_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "nrc_blocks_zine_passage" AS t SET "kicker" = l."kicker", "heading" = l."heading", "lede" = l."lede", "body" = l."body" FROM "nrc_blocks_zine_passage_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_hero_slider_items" AS t SET "title" = l."title", "subtext" = l."subtext" FROM "troupe_blocks_hero_slider_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_hero" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "troupe_blocks_hero_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_playbill_voices" AS t SET "voice" = l."voice", "descriptor" = l."descriptor", "roles" = l."roles", "note" = l."note" FROM "troupe_blocks_playbill_voices_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_playbill" AS t SET "program_number" = l."program_number", "subtitle" = l."subtitle", "runtime" = l."runtime", "notes" = l."notes" FROM "troupe_blocks_playbill_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_rich_text" AS t SET "content" = l."content" FROM "troupe_blocks_rich_text_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_two_col" AS t SET "left_heading" = l."left_heading", "right_body" = l."right_body" FROM "troupe_blocks_two_col_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_cta_buttons" AS t SET "label" = l."label" FROM "troupe_blocks_cta_buttons_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_cta" AS t SET "heading" = l."heading", "subtext" = l."subtext" FROM "troupe_blocks_cta_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_quotes_quotes" AS t SET "quote" = l."quote", "attribution" = l."attribution" FROM "troupe_blocks_quotes_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_quotes" AS t SET "heading" = l."heading" FROM "troupe_blocks_quotes_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_stats_stats" AS t SET "label" = l."label" FROM "troupe_blocks_stats_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_stats" AS t SET "heading" = l."heading" FROM "troupe_blocks_stats_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_blocks_divider" AS t SET "label" = l."label" FROM "troupe_blocks_divider_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_program_cast" AS t SET "role" = l."role" FROM "troupe_program_cast_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "troupe_program" AS t SET "subtitle" = l."subtitle", "logline" = l."logline", "programme_note" = l."programme_note", "credits" = l."credits" FROM "troupe_program_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_photo_fold" AS t SET "kicker" = l."kicker", "heading" = l."heading", "caption" = l."caption", "credit" = l."credit" FROM "v9_home_blocks_photo_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_route_line_links" AS t SET "label" = l."label" FROM "v9_home_blocks_route_line_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_text_fold" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "lede" = l."lede", "body" = l."body", "quote" = l."quote", "cite" = l."cite", "more_label" = l."more_label", "link_label" = l."link_label", "aria_label" = l."aria_label" FROM "v9_home_blocks_text_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_quote_feature" AS t SET "quote" = l."quote", "cite" = l."cite", "note" = l."note" FROM "v9_home_blocks_quote_feature_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_slate_list_rows" AS t SET "logline" = l."logline", "provenance" = l."provenance" FROM "v9_home_blocks_slate_list_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_footnote" AS t SET "body" = l."body" FROM "v9_home_blocks_footnote_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_request" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "link_label" = l."link_label" FROM "v9_home_blocks_request_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_ledger_rows" AS t SET "term" = l."term", "definition" = l."definition" FROM "v9_home_blocks_ledger_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_ledger" AS t SET "aria_label" = l."aria_label" FROM "v9_home_blocks_ledger_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_archival" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_home_blocks_archival_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_division_strip_divisions" AS t SET "blurb" = l."blurb" FROM "v9_home_blocks_division_strip_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_mood_grid_items" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_home_blocks_mood_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_mood_grid" AS t SET "aria_label" = l."aria_label", "scene_slug" = l."scene_slug", "heading" = l."heading" FROM "v9_home_blocks_mood_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home_blocks_founding_roll" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "submit_label" = l."submit_label", "success_note" = l."success_note" FROM "v9_home_blocks_founding_roll_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_home" AS t SET "seo_title" = l."seo_title", "seo_description" = l."seo_description" FROM "v9_home_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_photo_fold" AS t SET "kicker" = l."kicker", "heading" = l."heading", "caption" = l."caption", "credit" = l."credit" FROM "v9_slate_blocks_photo_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_route_line_links" AS t SET "label" = l."label" FROM "v9_slate_blocks_route_line_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_text_fold" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "lede" = l."lede", "body" = l."body", "quote" = l."quote", "cite" = l."cite", "more_label" = l."more_label", "link_label" = l."link_label", "aria_label" = l."aria_label" FROM "v9_slate_blocks_text_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_quote_feature" AS t SET "quote" = l."quote", "cite" = l."cite", "note" = l."note" FROM "v9_slate_blocks_quote_feature_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_slate_list_rows" AS t SET "logline" = l."logline", "provenance" = l."provenance" FROM "v9_slate_blocks_slate_list_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_footnote" AS t SET "body" = l."body" FROM "v9_slate_blocks_footnote_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_request" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "link_label" = l."link_label" FROM "v9_slate_blocks_request_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_ledger_rows" AS t SET "term" = l."term", "definition" = l."definition" FROM "v9_slate_blocks_ledger_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_ledger" AS t SET "aria_label" = l."aria_label" FROM "v9_slate_blocks_ledger_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_archival" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_slate_blocks_archival_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_division_strip_divisions" AS t SET "blurb" = l."blurb" FROM "v9_slate_blocks_division_strip_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_mood_grid_items" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_slate_blocks_mood_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_mood_grid" AS t SET "aria_label" = l."aria_label", "scene_slug" = l."scene_slug", "heading" = l."heading" FROM "v9_slate_blocks_mood_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate_blocks_founding_roll" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "submit_label" = l."submit_label", "success_note" = l."success_note" FROM "v9_slate_blocks_founding_roll_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_slate" AS t SET "seo_title" = l."seo_title", "seo_description" = l."seo_description" FROM "v9_slate_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_photo_fold" AS t SET "kicker" = l."kicker", "heading" = l."heading", "caption" = l."caption", "credit" = l."credit" FROM "v9_craft_blocks_photo_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_route_line_links" AS t SET "label" = l."label" FROM "v9_craft_blocks_route_line_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_text_fold" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "lede" = l."lede", "body" = l."body", "quote" = l."quote", "cite" = l."cite", "more_label" = l."more_label", "link_label" = l."link_label", "aria_label" = l."aria_label" FROM "v9_craft_blocks_text_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_quote_feature" AS t SET "quote" = l."quote", "cite" = l."cite", "note" = l."note" FROM "v9_craft_blocks_quote_feature_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_slate_list_rows" AS t SET "logline" = l."logline", "provenance" = l."provenance" FROM "v9_craft_blocks_slate_list_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_footnote" AS t SET "body" = l."body" FROM "v9_craft_blocks_footnote_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_request" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "link_label" = l."link_label" FROM "v9_craft_blocks_request_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_ledger_rows" AS t SET "term" = l."term", "definition" = l."definition" FROM "v9_craft_blocks_ledger_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_ledger" AS t SET "aria_label" = l."aria_label" FROM "v9_craft_blocks_ledger_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_archival" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_craft_blocks_archival_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_division_strip_divisions" AS t SET "blurb" = l."blurb" FROM "v9_craft_blocks_division_strip_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_mood_grid_items" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_craft_blocks_mood_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_mood_grid" AS t SET "aria_label" = l."aria_label", "scene_slug" = l."scene_slug", "heading" = l."heading" FROM "v9_craft_blocks_mood_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft_blocks_founding_roll" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "submit_label" = l."submit_label", "success_note" = l."success_note" FROM "v9_craft_blocks_founding_roll_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_craft" AS t SET "seo_title" = l."seo_title", "seo_description" = l."seo_description" FROM "v9_craft_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_photo_fold" AS t SET "kicker" = l."kicker", "heading" = l."heading", "caption" = l."caption", "credit" = l."credit" FROM "v9_methods_blocks_photo_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_route_line_links" AS t SET "label" = l."label" FROM "v9_methods_blocks_route_line_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_text_fold" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "lede" = l."lede", "body" = l."body", "quote" = l."quote", "cite" = l."cite", "more_label" = l."more_label", "link_label" = l."link_label", "aria_label" = l."aria_label" FROM "v9_methods_blocks_text_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_quote_feature" AS t SET "quote" = l."quote", "cite" = l."cite", "note" = l."note" FROM "v9_methods_blocks_quote_feature_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_slate_list_rows" AS t SET "logline" = l."logline", "provenance" = l."provenance" FROM "v9_methods_blocks_slate_list_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_footnote" AS t SET "body" = l."body" FROM "v9_methods_blocks_footnote_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_request" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "link_label" = l."link_label" FROM "v9_methods_blocks_request_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_ledger_rows" AS t SET "term" = l."term", "definition" = l."definition" FROM "v9_methods_blocks_ledger_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_ledger" AS t SET "aria_label" = l."aria_label" FROM "v9_methods_blocks_ledger_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_archival" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_methods_blocks_archival_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_division_strip_divisions" AS t SET "blurb" = l."blurb" FROM "v9_methods_blocks_division_strip_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_mood_grid_items" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_methods_blocks_mood_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_mood_grid" AS t SET "aria_label" = l."aria_label", "scene_slug" = l."scene_slug", "heading" = l."heading" FROM "v9_methods_blocks_mood_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods_blocks_founding_roll" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "submit_label" = l."submit_label", "success_note" = l."success_note" FROM "v9_methods_blocks_founding_roll_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_methods" AS t SET "seo_title" = l."seo_title", "seo_description" = l."seo_description" FROM "v9_methods_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_photo_fold" AS t SET "kicker" = l."kicker", "heading" = l."heading", "caption" = l."caption", "credit" = l."credit" FROM "v9_contact_blocks_photo_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_route_line_links" AS t SET "label" = l."label" FROM "v9_contact_blocks_route_line_links_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_text_fold" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "lede" = l."lede", "body" = l."body", "quote" = l."quote", "cite" = l."cite", "more_label" = l."more_label", "link_label" = l."link_label", "aria_label" = l."aria_label" FROM "v9_contact_blocks_text_fold_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_quote_feature" AS t SET "quote" = l."quote", "cite" = l."cite", "note" = l."note" FROM "v9_contact_blocks_quote_feature_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_slate_list_rows" AS t SET "logline" = l."logline", "provenance" = l."provenance" FROM "v9_contact_blocks_slate_list_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_footnote" AS t SET "body" = l."body" FROM "v9_contact_blocks_footnote_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_request" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "link_label" = l."link_label" FROM "v9_contact_blocks_request_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_ledger_rows" AS t SET "term" = l."term", "definition" = l."definition" FROM "v9_contact_blocks_ledger_rows_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_ledger" AS t SET "aria_label" = l."aria_label" FROM "v9_contact_blocks_ledger_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_archival" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_contact_blocks_archival_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_division_strip_divisions" AS t SET "blurb" = l."blurb" FROM "v9_contact_blocks_division_strip_divisions_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_mood_grid_items" AS t SET "caption" = l."caption", "credit" = l."credit" FROM "v9_contact_blocks_mood_grid_items_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_mood_grid" AS t SET "aria_label" = l."aria_label", "scene_slug" = l."scene_slug", "heading" = l."heading" FROM "v9_contact_blocks_mood_grid_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact_blocks_founding_roll" AS t SET "scene_slug" = l."scene_slug", "heading" = l."heading", "body" = l."body", "submit_label" = l."submit_label", "success_note" = l."success_note" FROM "v9_contact_blocks_founding_roll_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "v9_contact" AS t SET "seo_title" = l."seo_title", "seo_description" = l."seo_description" FROM "v9_contact_locales" AS l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  ALTER TABLE "media" ALTER COLUMN "alt" DROP DEFAULT;
  ALTER TABLE "projects_gallery" ALTER COLUMN "credit" DROP DEFAULT;
  ALTER TABLE "projects_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "projects_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "projects_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "projects_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "projects_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "projects_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "projects_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "projects_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "projects_blocks_zine_synopsis" ALTER COLUMN "body" DROP DEFAULT;
  ALTER TABLE "news_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "news_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "news_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "news_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "news_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "news_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "news_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "news_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "news" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_cover_lines" ALTER COLUMN "text" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_contents_entries" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_contents" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_editorial_paragraphs" ALTER COLUMN "text" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_feature_title_parts" ALTER COLUMN "text" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_feature_meta" ALTER COLUMN "value" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_feature_paragraphs" ALTER COLUMN "text" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_feature_factbox_fields" ALTER COLUMN "value" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_dispatches" ALTER COLUMN "date" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_dispatches" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_trades" ALTER COLUMN "headline" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_calendar" ALTER COLUMN "date" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_calendar" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_classifieds" ALTER COLUMN "cat" DROP DEFAULT;
  ALTER TABLE "dispatch_issues_classifieds" ALTER COLUMN "title" DROP DEFAULT;
  ALTER TABLE "dispatch_issues" ALTER COLUMN "display_title" DROP DEFAULT;
  ALTER TABLE "home_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "home_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "home_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "home_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "home_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "home_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "home_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "home_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "home_blocks_zine_passage_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "home_blocks_zine_passage" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "site_settings_v9_chrome_nav_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "footer_links_primary_nav" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "footer_links_division_nav" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "footer_links_more_nav" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "about_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "about_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "about_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "about_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "about_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "about_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "about_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "about_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "contact_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "contact_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "contact_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "contact_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "contact_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "contact_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "contact_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "contact_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "jobs_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "pitch_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "investors_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "investors_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "investors_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "investors_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "investors_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "investors_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "investors_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "investors_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "212_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "212_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "212_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "212_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "212_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "212_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "212_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "212_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "212_blocks_zine_passage_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "212_blocks_zine_passage" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "310_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "310_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "310_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "310_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "310_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "310_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "310_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "310_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "310_blocks_zine_passage_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "310_blocks_zine_passage" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_zine_passage_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "nrc_blocks_zine_passage" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_hero" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_playbill_voices" ALTER COLUMN "voice" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_playbill_voices" ALTER COLUMN "roles" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_rich_text" ALTER COLUMN "content" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_two_col" ALTER COLUMN "left_heading" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_two_col" ALTER COLUMN "right_body" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_cta_buttons" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_cta" ALTER COLUMN "heading" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_quotes_quotes" ALTER COLUMN "quote" DROP DEFAULT;
  ALTER TABLE "troupe_blocks_stats_stats" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "v9_home_blocks_route_line_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "v9_slate_blocks_route_line_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "v9_craft_blocks_route_line_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "v9_methods_blocks_route_line_links" ALTER COLUMN "label" DROP DEFAULT;
  ALTER TABLE "v9_contact_blocks_route_line_links" ALTER COLUMN "label" DROP DEFAULT;
`)

  // 3. and only then drop the locale tables and the AI Mark flag.
  await db.execute(sql`
   DROP TABLE "media_locales" CASCADE;
  DROP TABLE "projects_gallery_locales" CASCADE;
  DROP TABLE "projects_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "projects_blocks_hero_locales" CASCADE;
  DROP TABLE "projects_blocks_rich_text_locales" CASCADE;
  DROP TABLE "projects_blocks_two_col_locales" CASCADE;
  DROP TABLE "projects_blocks_grid_items_locales" CASCADE;
  DROP TABLE "projects_blocks_grid_locales" CASCADE;
  DROP TABLE "projects_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "projects_blocks_cta_locales" CASCADE;
  DROP TABLE "projects_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "projects_blocks_quotes_locales" CASCADE;
  DROP TABLE "projects_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "projects_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "projects_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "projects_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "projects_blocks_stats_locales" CASCADE;
  DROP TABLE "projects_blocks_divider_locales" CASCADE;
  DROP TABLE "projects_blocks_zine_synopsis_locales" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "news_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "news_blocks_hero_locales" CASCADE;
  DROP TABLE "news_blocks_rich_text_locales" CASCADE;
  DROP TABLE "news_blocks_two_col_locales" CASCADE;
  DROP TABLE "news_blocks_grid_items_locales" CASCADE;
  DROP TABLE "news_blocks_grid_locales" CASCADE;
  DROP TABLE "news_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "news_blocks_cta_locales" CASCADE;
  DROP TABLE "news_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "news_blocks_quotes_locales" CASCADE;
  DROP TABLE "news_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "news_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "news_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "news_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "news_blocks_stats_locales" CASCADE;
  DROP TABLE "news_blocks_divider_locales" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "dispatch_issues_cover_lines_locales" CASCADE;
  DROP TABLE "dispatch_issues_cover_coverlines_locales" CASCADE;
  DROP TABLE "dispatch_issues_contents_entries_locales" CASCADE;
  DROP TABLE "dispatch_issues_contents_locales" CASCADE;
  DROP TABLE "dispatch_issues_editorial_paragraphs_locales" CASCADE;
  DROP TABLE "dispatch_issues_feature_title_parts_locales" CASCADE;
  DROP TABLE "dispatch_issues_feature_meta_locales" CASCADE;
  DROP TABLE "dispatch_issues_feature_paragraphs_locales" CASCADE;
  DROP TABLE "dispatch_issues_feature_factbox_fields_locales" CASCADE;
  DROP TABLE "dispatch_issues_feature_related_locales" CASCADE;
  DROP TABLE "dispatch_issues_dispatches_locales" CASCADE;
  DROP TABLE "dispatch_issues_trades_locales" CASCADE;
  DROP TABLE "dispatch_issues_calendar_locales" CASCADE;
  DROP TABLE "dispatch_issues_classifieds_locales" CASCADE;
  DROP TABLE "dispatch_issues_archive_locales" CASCADE;
  DROP TABLE "dispatch_issues_locales" CASCADE;
  DROP TABLE "home_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "home_blocks_hero_locales" CASCADE;
  DROP TABLE "home_blocks_rich_text_locales" CASCADE;
  DROP TABLE "home_blocks_two_col_locales" CASCADE;
  DROP TABLE "home_blocks_grid_items_locales" CASCADE;
  DROP TABLE "home_blocks_grid_locales" CASCADE;
  DROP TABLE "home_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "home_blocks_cta_locales" CASCADE;
  DROP TABLE "home_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "home_blocks_quotes_locales" CASCADE;
  DROP TABLE "home_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "home_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "home_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "home_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "home_blocks_stats_locales" CASCADE;
  DROP TABLE "home_blocks_divider_locales" CASCADE;
  DROP TABLE "home_blocks_zine_masthead_locales" CASCADE;
  DROP TABLE "home_blocks_zine_passage_links_locales" CASCADE;
  DROP TABLE "home_blocks_zine_passage_locales" CASCADE;
  DROP TABLE "site_settings_enabled_locales" CASCADE;
  DROP TABLE "site_settings_v9_chrome_nav_links_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "footer_links_primary_nav_locales" CASCADE;
  DROP TABLE "footer_links_division_nav_locales" CASCADE;
  DROP TABLE "footer_links_more_nav_locales" CASCADE;
  DROP TABLE "about_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "about_blocks_hero_locales" CASCADE;
  DROP TABLE "about_blocks_rich_text_locales" CASCADE;
  DROP TABLE "about_blocks_two_col_locales" CASCADE;
  DROP TABLE "about_blocks_grid_items_locales" CASCADE;
  DROP TABLE "about_blocks_grid_locales" CASCADE;
  DROP TABLE "about_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "about_blocks_cta_locales" CASCADE;
  DROP TABLE "about_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "about_blocks_quotes_locales" CASCADE;
  DROP TABLE "about_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "about_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "about_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "about_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "about_blocks_stats_locales" CASCADE;
  DROP TABLE "about_blocks_divider_locales" CASCADE;
  DROP TABLE "contact_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "contact_blocks_hero_locales" CASCADE;
  DROP TABLE "contact_blocks_rich_text_locales" CASCADE;
  DROP TABLE "contact_blocks_two_col_locales" CASCADE;
  DROP TABLE "contact_blocks_grid_items_locales" CASCADE;
  DROP TABLE "contact_blocks_grid_locales" CASCADE;
  DROP TABLE "contact_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "contact_blocks_cta_locales" CASCADE;
  DROP TABLE "contact_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "contact_blocks_quotes_locales" CASCADE;
  DROP TABLE "contact_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "contact_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "contact_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "contact_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "contact_blocks_stats_locales" CASCADE;
  DROP TABLE "contact_blocks_divider_locales" CASCADE;
  DROP TABLE "jobs_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "jobs_blocks_hero_locales" CASCADE;
  DROP TABLE "jobs_blocks_rich_text_locales" CASCADE;
  DROP TABLE "jobs_blocks_two_col_locales" CASCADE;
  DROP TABLE "jobs_blocks_grid_items_locales" CASCADE;
  DROP TABLE "jobs_blocks_grid_locales" CASCADE;
  DROP TABLE "jobs_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "jobs_blocks_cta_locales" CASCADE;
  DROP TABLE "jobs_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "jobs_blocks_quotes_locales" CASCADE;
  DROP TABLE "jobs_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "jobs_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "jobs_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "jobs_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "jobs_blocks_stats_locales" CASCADE;
  DROP TABLE "jobs_blocks_divider_locales" CASCADE;
  DROP TABLE "pitch_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "pitch_blocks_hero_locales" CASCADE;
  DROP TABLE "pitch_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pitch_blocks_two_col_locales" CASCADE;
  DROP TABLE "pitch_blocks_grid_items_locales" CASCADE;
  DROP TABLE "pitch_blocks_grid_locales" CASCADE;
  DROP TABLE "pitch_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "pitch_blocks_cta_locales" CASCADE;
  DROP TABLE "pitch_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "pitch_blocks_quotes_locales" CASCADE;
  DROP TABLE "pitch_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "pitch_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "pitch_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "pitch_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "pitch_blocks_stats_locales" CASCADE;
  DROP TABLE "pitch_blocks_divider_locales" CASCADE;
  DROP TABLE "investors_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "investors_blocks_hero_locales" CASCADE;
  DROP TABLE "investors_blocks_rich_text_locales" CASCADE;
  DROP TABLE "investors_blocks_two_col_locales" CASCADE;
  DROP TABLE "investors_blocks_grid_items_locales" CASCADE;
  DROP TABLE "investors_blocks_grid_locales" CASCADE;
  DROP TABLE "investors_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "investors_blocks_cta_locales" CASCADE;
  DROP TABLE "investors_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "investors_blocks_quotes_locales" CASCADE;
  DROP TABLE "investors_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "investors_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "investors_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "investors_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "investors_blocks_stats_locales" CASCADE;
  DROP TABLE "investors_blocks_divider_locales" CASCADE;
  DROP TABLE "212_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "212_blocks_hero_locales" CASCADE;
  DROP TABLE "212_blocks_rich_text_locales" CASCADE;
  DROP TABLE "212_blocks_two_col_locales" CASCADE;
  DROP TABLE "212_blocks_grid_items_locales" CASCADE;
  DROP TABLE "212_blocks_grid_locales" CASCADE;
  DROP TABLE "212_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "212_blocks_cta_locales" CASCADE;
  DROP TABLE "212_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "212_blocks_quotes_locales" CASCADE;
  DROP TABLE "212_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "212_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "212_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "212_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "212_blocks_stats_locales" CASCADE;
  DROP TABLE "212_blocks_divider_locales" CASCADE;
  DROP TABLE "212_blocks_zine_passage_links_locales" CASCADE;
  DROP TABLE "212_blocks_zine_passage_locales" CASCADE;
  DROP TABLE "310_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "310_blocks_hero_locales" CASCADE;
  DROP TABLE "310_blocks_rich_text_locales" CASCADE;
  DROP TABLE "310_blocks_two_col_locales" CASCADE;
  DROP TABLE "310_blocks_grid_items_locales" CASCADE;
  DROP TABLE "310_blocks_grid_locales" CASCADE;
  DROP TABLE "310_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "310_blocks_cta_locales" CASCADE;
  DROP TABLE "310_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "310_blocks_quotes_locales" CASCADE;
  DROP TABLE "310_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "310_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "310_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "310_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "310_blocks_stats_locales" CASCADE;
  DROP TABLE "310_blocks_divider_locales" CASCADE;
  DROP TABLE "310_blocks_zine_passage_links_locales" CASCADE;
  DROP TABLE "310_blocks_zine_passage_locales" CASCADE;
  DROP TABLE "nrc_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "nrc_blocks_hero_locales" CASCADE;
  DROP TABLE "nrc_blocks_rich_text_locales" CASCADE;
  DROP TABLE "nrc_blocks_two_col_locales" CASCADE;
  DROP TABLE "nrc_blocks_grid_items_locales" CASCADE;
  DROP TABLE "nrc_blocks_grid_locales" CASCADE;
  DROP TABLE "nrc_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "nrc_blocks_cta_locales" CASCADE;
  DROP TABLE "nrc_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "nrc_blocks_quotes_locales" CASCADE;
  DROP TABLE "nrc_blocks_filmstrip_tiles_locales" CASCADE;
  DROP TABLE "nrc_blocks_division_showcase_divisions_locales" CASCADE;
  DROP TABLE "nrc_blocks_division_showcase_locales" CASCADE;
  DROP TABLE "nrc_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "nrc_blocks_stats_locales" CASCADE;
  DROP TABLE "nrc_blocks_divider_locales" CASCADE;
  DROP TABLE "nrc_blocks_zine_passage_links_locales" CASCADE;
  DROP TABLE "nrc_blocks_zine_passage_locales" CASCADE;
  DROP TABLE "troupe_blocks_hero_slider_items_locales" CASCADE;
  DROP TABLE "troupe_blocks_hero_locales" CASCADE;
  DROP TABLE "troupe_blocks_playbill_voices_locales" CASCADE;
  DROP TABLE "troupe_blocks_playbill_locales" CASCADE;
  DROP TABLE "troupe_blocks_rich_text_locales" CASCADE;
  DROP TABLE "troupe_blocks_two_col_locales" CASCADE;
  DROP TABLE "troupe_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "troupe_blocks_cta_locales" CASCADE;
  DROP TABLE "troupe_blocks_quotes_quotes_locales" CASCADE;
  DROP TABLE "troupe_blocks_quotes_locales" CASCADE;
  DROP TABLE "troupe_blocks_stats_stats_locales" CASCADE;
  DROP TABLE "troupe_blocks_stats_locales" CASCADE;
  DROP TABLE "troupe_blocks_divider_locales" CASCADE;
  DROP TABLE "troupe_program_cast_locales" CASCADE;
  DROP TABLE "troupe_program_locales" CASCADE;
  DROP TABLE "v9_home_blocks_photo_fold_locales" CASCADE;
  DROP TABLE "v9_home_blocks_route_line_links_locales" CASCADE;
  DROP TABLE "v9_home_blocks_text_fold_locales" CASCADE;
  DROP TABLE "v9_home_blocks_quote_feature_locales" CASCADE;
  DROP TABLE "v9_home_blocks_slate_list_rows_locales" CASCADE;
  DROP TABLE "v9_home_blocks_footnote_locales" CASCADE;
  DROP TABLE "v9_home_blocks_request_locales" CASCADE;
  DROP TABLE "v9_home_blocks_ledger_rows_locales" CASCADE;
  DROP TABLE "v9_home_blocks_ledger_locales" CASCADE;
  DROP TABLE "v9_home_blocks_archival_locales" CASCADE;
  DROP TABLE "v9_home_blocks_division_strip_divisions_locales" CASCADE;
  DROP TABLE "v9_home_blocks_mood_grid_items_locales" CASCADE;
  DROP TABLE "v9_home_blocks_mood_grid_locales" CASCADE;
  DROP TABLE "v9_home_blocks_founding_roll_locales" CASCADE;
  DROP TABLE "v9_home_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_photo_fold_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_route_line_links_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_text_fold_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_quote_feature_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_slate_list_rows_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_footnote_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_request_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_ledger_rows_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_ledger_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_archival_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_division_strip_divisions_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_mood_grid_items_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_mood_grid_locales" CASCADE;
  DROP TABLE "v9_slate_blocks_founding_roll_locales" CASCADE;
  DROP TABLE "v9_slate_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_photo_fold_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_route_line_links_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_text_fold_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_quote_feature_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_slate_list_rows_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_footnote_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_request_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_ledger_rows_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_ledger_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_archival_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_division_strip_divisions_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_mood_grid_items_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_mood_grid_locales" CASCADE;
  DROP TABLE "v9_craft_blocks_founding_roll_locales" CASCADE;
  DROP TABLE "v9_craft_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_photo_fold_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_route_line_links_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_text_fold_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_quote_feature_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_slate_list_rows_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_footnote_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_request_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_ledger_rows_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_ledger_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_archival_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_division_strip_divisions_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_mood_grid_items_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_mood_grid_locales" CASCADE;
  DROP TABLE "v9_methods_blocks_founding_roll_locales" CASCADE;
  DROP TABLE "v9_methods_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_photo_fold_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_route_line_links_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_text_fold_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_quote_feature_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_slate_list_rows_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_footnote_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_request_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_ledger_rows_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_ledger_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_archival_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_division_strip_divisions_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_mood_grid_items_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_mood_grid_locales" CASCADE;
  DROP TABLE "v9_contact_blocks_founding_roll_locales" CASCADE;
  DROP TABLE "v9_contact_locales" CASCADE;
  ALTER TABLE "media" DROP COLUMN "ai_frame";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_site_settings_enabled_locales";
`)
}
