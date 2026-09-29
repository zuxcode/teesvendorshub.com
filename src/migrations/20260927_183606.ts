import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "avatars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"created_by_id" integer NOT NULL,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_small_url" varchar,
  	"sizes_small_width" numeric,
  	"sizes_small_height" numeric,
  	"sizes_small_mime_type" varchar,
  	"sizes_small_filesize" numeric,
  	"sizes_small_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  ALTER TABLE "product_library" DROP CONSTRAINT "product_library_uploaded_by_id_users_id_fk";
  
  DROP INDEX "product_library_uploaded_by_idx";
  ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
  ALTER TABLE "product_library" ADD COLUMN "created_by_id" integer NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "avatars_id" integer;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "avatars_user_idx" ON "avatars" USING btree ("user_id");
  CREATE INDEX "avatars_created_by_idx" ON "avatars" USING btree ("created_by_id");
  CREATE INDEX "avatars_updated_by_idx" ON "avatars" USING btree ("updated_by_id");
  CREATE INDEX "avatars_updated_at_idx" ON "avatars" USING btree ("updated_at");
  CREATE INDEX "avatars_created_at_idx" ON "avatars" USING btree ("created_at");
  CREATE UNIQUE INDEX "avatars_filename_idx" ON "avatars" USING btree ("filename");
  CREATE INDEX "avatars_sizes_small_sizes_small_filename_idx" ON "avatars" USING btree ("sizes_small_filename");
  CREATE INDEX "avatars_sizes_medium_sizes_medium_filename_idx" ON "avatars" USING btree ("sizes_medium_filename");
  CREATE INDEX "avatars_sizes_large_sizes_large_filename_idx" ON "avatars" USING btree ("sizes_large_filename");
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avatars_fk" FOREIGN KEY ("avatars_id") REFERENCES "public"."avatars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "product_library_created_by_idx" ON "product_library" USING btree ("created_by_id");
  CREATE INDEX "payload_locked_documents_rels_avatars_id_idx" ON "payload_locked_documents_rels" USING btree ("avatars_id");
  ALTER TABLE "product_library" DROP COLUMN "uploaded_by_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "avatars" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "avatars" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_avatars_id_fk";
  
  ALTER TABLE "product_library" DROP CONSTRAINT "product_library_created_by_id_users_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_avatars_fk";
  
  DROP INDEX "users_avatar_idx";
  DROP INDEX "product_library_created_by_idx";
  DROP INDEX "payload_locked_documents_rels_avatars_id_idx";
  ALTER TABLE "product_library" ADD COLUMN "uploaded_by_id" integer NOT NULL;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "product_library_uploaded_by_idx" ON "product_library" USING btree ("uploaded_by_id");
  ALTER TABLE "users" DROP COLUMN "avatar_id";
  ALTER TABLE "product_library" DROP COLUMN "created_by_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "avatars_id";`)
}
