import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "v9_home_blocks_founding_roll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"show_count" boolean DEFAULT true,
  	"success_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "v9_slate_blocks_founding_roll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"show_count" boolean DEFAULT true,
  	"success_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "v9_craft_blocks_founding_roll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"show_count" boolean DEFAULT true,
  	"success_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "v9_methods_blocks_founding_roll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"show_count" boolean DEFAULT true,
  	"success_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "v9_contact_blocks_founding_roll" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"scene" varchar,
  	"scene_slug" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"show_count" boolean DEFAULT true,
  	"success_note" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "v9_home_blocks_founding_roll" ADD CONSTRAINT "v9_home_blocks_founding_roll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_slate_blocks_founding_roll" ADD CONSTRAINT "v9_slate_blocks_founding_roll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_slate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_craft_blocks_founding_roll" ADD CONSTRAINT "v9_craft_blocks_founding_roll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_craft"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_methods_blocks_founding_roll" ADD CONSTRAINT "v9_methods_blocks_founding_roll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_methods"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "v9_contact_blocks_founding_roll" ADD CONSTRAINT "v9_contact_blocks_founding_roll_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."v9_contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "v9_home_blocks_founding_roll_order_idx" ON "v9_home_blocks_founding_roll" USING btree ("_order");
  CREATE INDEX "v9_home_blocks_founding_roll_parent_id_idx" ON "v9_home_blocks_founding_roll" USING btree ("_parent_id");
  CREATE INDEX "v9_home_blocks_founding_roll_path_idx" ON "v9_home_blocks_founding_roll" USING btree ("_path");
  CREATE INDEX "v9_slate_blocks_founding_roll_order_idx" ON "v9_slate_blocks_founding_roll" USING btree ("_order");
  CREATE INDEX "v9_slate_blocks_founding_roll_parent_id_idx" ON "v9_slate_blocks_founding_roll" USING btree ("_parent_id");
  CREATE INDEX "v9_slate_blocks_founding_roll_path_idx" ON "v9_slate_blocks_founding_roll" USING btree ("_path");
  CREATE INDEX "v9_craft_blocks_founding_roll_order_idx" ON "v9_craft_blocks_founding_roll" USING btree ("_order");
  CREATE INDEX "v9_craft_blocks_founding_roll_parent_id_idx" ON "v9_craft_blocks_founding_roll" USING btree ("_parent_id");
  CREATE INDEX "v9_craft_blocks_founding_roll_path_idx" ON "v9_craft_blocks_founding_roll" USING btree ("_path");
  CREATE INDEX "v9_methods_blocks_founding_roll_order_idx" ON "v9_methods_blocks_founding_roll" USING btree ("_order");
  CREATE INDEX "v9_methods_blocks_founding_roll_parent_id_idx" ON "v9_methods_blocks_founding_roll" USING btree ("_parent_id");
  CREATE INDEX "v9_methods_blocks_founding_roll_path_idx" ON "v9_methods_blocks_founding_roll" USING btree ("_path");
  CREATE INDEX "v9_contact_blocks_founding_roll_order_idx" ON "v9_contact_blocks_founding_roll" USING btree ("_order");
  CREATE INDEX "v9_contact_blocks_founding_roll_parent_id_idx" ON "v9_contact_blocks_founding_roll" USING btree ("_parent_id");
  CREATE INDEX "v9_contact_blocks_founding_roll_path_idx" ON "v9_contact_blocks_founding_roll" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "v9_home_blocks_founding_roll" CASCADE;
  DROP TABLE "v9_slate_blocks_founding_roll" CASCADE;
  DROP TABLE "v9_craft_blocks_founding_roll" CASCADE;
  DROP TABLE "v9_methods_blocks_founding_roll" CASCADE;
  DROP TABLE "v9_contact_blocks_founding_roll" CASCADE;`)
}
