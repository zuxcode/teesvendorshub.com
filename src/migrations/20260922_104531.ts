import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'customer');
  CREATE TYPE "public"."enum_products_badges" AS ENUM('best_seller', 'coming_soon', 'featured', 'new', 'trending');
  CREATE TYPE "public"."enum_products_product_type" AS ENUM('physical', 'digital');
  CREATE TYPE "public"."enum_products_status" AS ENUM('active', 'draft', 'inactive', 'archived');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_inventory_type" AS ENUM('restock', 'sale', 'return', 'adjustment', 'damaged', 'expired');
  CREATE TYPE "public"."enum_tax_rules_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_tax_rules_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_tax_rules_country" AS ENUM('NG');
  CREATE TYPE "public"."enum_tax_rules_applies_to" AS ENUM('all', 'products', 'categories');
  CREATE TYPE "public"."enum_tax_rules_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_orders_order_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'partially-refunded', 'partially-paid');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_order_items_product_type" AS ENUM('physical', 'digital');
  CREATE TYPE "public"."enum_order_items_order_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('payment', 'refund', 'chargeback');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('pending', 'successful', 'failed', 'cancelled');
  CREATE TYPE "public"."enum_transactions_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_transactions_provider" AS ENUM('transactpay');
  CREATE TYPE "public"."enum_payments_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_payments_provider" AS ENUM('transactpay');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'successful', 'failed', 'partially-paid', 'refunded', 'partially-refunded');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sendWelcomeEmail');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sendWelcomeEmail');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'customer',
  	"full_name" varchar NOT NULL,
  	"phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "product_library" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"uploaded_by_id" integer NOT NULL,
  	"updated_by_id" integer,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'product',
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
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar
  );
  
  CREATE TABLE "products_badges" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_products_badges",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"product_image_id" integer NOT NULL,
  	"slug" varchar NOT NULL,
  	"product_type" "enum_products_product_type" DEFAULT 'physical' NOT NULL,
  	"status" "enum_products_status" DEFAULT 'active' NOT NULL,
  	"stock" numeric DEFAULT 0 NOT NULL,
  	"price" numeric NOT NULL,
  	"country" varchar,
  	"category_id" integer NOT NULL,
  	"secret" varchar NOT NULL,
  	"buyer_id" integer,
  	"created_by_id" integer NOT NULL,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"category_image_id" integer,
  	"parent_id" integer,
  	"status" "enum_categories_status" DEFAULT 'active' NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"created_by_id" integer NOT NULL,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inventory" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"type" "enum_inventory_type" NOT NULL,
  	"quantity" numeric NOT NULL,
  	"quantity_before" numeric DEFAULT 0 NOT NULL,
  	"quantity_after" numeric DEFAULT 0 NOT NULL,
  	"reference" varchar,
  	"notes" varchar,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tax_rules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"type" "enum_tax_rules_type" DEFAULT 'percentage' NOT NULL,
  	"rate" numeric,
  	"amount" numeric,
  	"currency" "enum_tax_rules_currency" DEFAULT 'NGN' NOT NULL,
  	"country" "enum_tax_rules_country" DEFAULT 'NG' NOT NULL,
  	"applies_to" "enum_tax_rules_applies_to" DEFAULT 'all' NOT NULL,
  	"status" "enum_tax_rules_status" DEFAULT 'active' NOT NULL,
  	"effective_from" timestamp(3) with time zone,
  	"effective_until" timestamp(3) with time zone,
  	"created_by_id" integer NOT NULL,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tax_rules_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"buyer_id" integer NOT NULL,
  	"order_status" "enum_orders_order_status" DEFAULT 'pending' NOT NULL,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"currency" "enum_orders_currency" DEFAULT 'NGN' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"shipping_amount" numeric DEFAULT 0 NOT NULL,
  	"tax_amount" numeric DEFAULT 0 NOT NULL,
  	"total" numeric NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"shipping_address_full_name" varchar NOT NULL,
  	"shipping_address_address_line1" varchar NOT NULL,
  	"shipping_address_address_line2" varchar,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_state" varchar NOT NULL,
  	"shipping_address_postal_code" varchar,
  	"shipping_address_country" varchar NOT NULL,
  	"delivery_instructions" varchar,
  	"internal_notes" varchar,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "order_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" integer NOT NULL,
  	"product_id" integer NOT NULL,
  	"product_name" varchar NOT NULL,
  	"product_type" "enum_order_items_product_type" NOT NULL,
  	"product_image_id" integer,
  	"unit_price" numeric NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"line_total" numeric NOT NULL,
  	"order_status" "enum_order_items_order_status" DEFAULT 'pending' NOT NULL,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"order_id" integer NOT NULL,
  	"customer_id" integer NOT NULL,
  	"type" "enum_transactions_type" NOT NULL,
  	"status" "enum_transactions_status" DEFAULT 'pending' NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" "enum_transactions_currency" DEFAULT 'NGN' NOT NULL,
  	"provider" "enum_transactions_provider" NOT NULL,
  	"provider_reference" varchar,
  	"provider_response" jsonb,
  	"parent_transaction_id" integer,
  	"failure_code" varchar,
  	"failure_message" varchar,
  	"description" varchar,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_reference" varchar NOT NULL,
  	"checkout_url" varchar,
  	"provider_reference" varchar,
  	"provider_fee" numeric,
  	"total_amount_charged" numeric,
  	"order_id" integer NOT NULL,
  	"buyer_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" "enum_payments_currency" DEFAULT 'NGN' NOT NULL,
  	"provider" "enum_payments_provider" DEFAULT 'transactpay' NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"refunded_at" timestamp(3) with time zone,
  	"metadata" jsonb,
  	"created_by_id" integer,
  	"updated_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"product_library_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"inventory_id" integer,
  	"tax_rules_id" integer,
  	"orders_id" integer,
  	"order_items_id" integer,
  	"transactions_id" integer,
  	"payments_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_category_image_id_product_library_id_fk" FOREIGN KEY ("category_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory" ADD CONSTRAINT "inventory_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory" ADD CONSTRAINT "inventory_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tax_rules" ADD CONSTRAINT "tax_rules_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tax_rules_rels" ADD CONSTRAINT "tax_rules_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tax_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tax_rules_rels" ADD CONSTRAINT "tax_rules_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tax_rules_rels" ADD CONSTRAINT "tax_rules_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_parent_transaction_id_transactions_id_fk" FOREIGN KEY ("parent_transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_library_fk" FOREIGN KEY ("product_library_id") REFERENCES "public"."product_library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inventory_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tax_rules_fk" FOREIGN KEY ("tax_rules_id") REFERENCES "public"."tax_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_items_fk" FOREIGN KEY ("order_items_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "product_library_filename_compound_idx" ON "product_library" USING btree ("filename");
  CREATE INDEX "product_library_uploaded_by_idx" ON "product_library" USING btree ("uploaded_by_id");
  CREATE INDEX "product_library_updated_by_idx" ON "product_library" USING btree ("updated_by_id");
  CREATE INDEX "product_library_updated_at_idx" ON "product_library" USING btree ("updated_at");
  CREATE INDEX "product_library_created_at_idx" ON "product_library" USING btree ("created_at");
  CREATE INDEX "product_library_filename_idx" ON "product_library" USING btree ("filename");
  CREATE INDEX "product_library_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "product_library" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "product_library_sizes_card_sizes_card_filename_idx" ON "product_library" USING btree ("sizes_card_filename");
  CREATE INDEX "product_library_sizes_large_sizes_large_filename_idx" ON "product_library" USING btree ("sizes_large_filename");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_product_image_idx" ON "products" USING btree ("product_image_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_product_type_idx" ON "products" USING btree ("product_type");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "products_stock_idx" ON "products" USING btree ("stock");
  CREATE INDEX "products_price_idx" ON "products" USING btree ("price");
  CREATE INDEX "products_country_idx" ON "products" USING btree ("country");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_buyer_idx" ON "products" USING btree ("buyer_id");
  CREATE INDEX "products_created_by_idx" ON "products" USING btree ("created_by_id");
  CREATE INDEX "products_updated_by_idx" ON "products" USING btree ("updated_by_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "status_productType_idx" ON "products" USING btree ("status","product_type");
  CREATE INDEX "status_country_price_idx" ON "products" USING btree ("status","country","price");
  CREATE INDEX "category_status_idx" ON "products" USING btree ("category_id","status");
  CREATE INDEX "stock_idx" ON "products" USING btree ("stock");
  CREATE INDEX "buyer_createdAt_idx" ON "products" USING btree ("buyer_id","created_at");
  CREATE INDEX "createdBy_createdAt_idx" ON "products" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_category_image_idx" ON "categories" USING btree ("category_image_id");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_created_by_idx" ON "categories" USING btree ("created_by_id");
  CREATE INDEX "categories_updated_by_idx" ON "categories" USING btree ("updated_by_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "inventory_product_idx" ON "inventory" USING btree ("product_id");
  CREATE INDEX "inventory_type_idx" ON "inventory" USING btree ("type");
  CREATE INDEX "inventory_reference_idx" ON "inventory" USING btree ("reference");
  CREATE INDEX "inventory_created_by_idx" ON "inventory" USING btree ("created_by_id");
  CREATE INDEX "inventory_updated_by_idx" ON "inventory" USING btree ("updated_by_id");
  CREATE INDEX "inventory_updated_at_idx" ON "inventory" USING btree ("updated_at");
  CREATE INDEX "inventory_created_at_idx" ON "inventory" USING btree ("created_at");
  CREATE INDEX "product_createdAt_idx" ON "inventory" USING btree ("product_id","created_at");
  CREATE INDEX "product_type_createdAt_idx" ON "inventory" USING btree ("product_id","type","created_at");
  CREATE INDEX "createdBy_createdAt_1_idx" ON "inventory" USING btree ("created_by_id","created_at");
  CREATE INDEX "reference_idx" ON "inventory" USING btree ("reference");
  CREATE INDEX "tax_rules_type_idx" ON "tax_rules" USING btree ("type");
  CREATE INDEX "tax_rules_currency_idx" ON "tax_rules" USING btree ("currency");
  CREATE INDEX "tax_rules_country_idx" ON "tax_rules" USING btree ("country");
  CREATE INDEX "tax_rules_applies_to_idx" ON "tax_rules" USING btree ("applies_to");
  CREATE INDEX "tax_rules_status_idx" ON "tax_rules" USING btree ("status");
  CREATE INDEX "tax_rules_created_by_idx" ON "tax_rules" USING btree ("created_by_id");
  CREATE INDEX "tax_rules_updated_by_idx" ON "tax_rules" USING btree ("updated_by_id");
  CREATE INDEX "tax_rules_updated_at_idx" ON "tax_rules" USING btree ("updated_at");
  CREATE INDEX "tax_rules_created_at_idx" ON "tax_rules" USING btree ("created_at");
  CREATE INDEX "status_country_idx" ON "tax_rules" USING btree ("status","country");
  CREATE INDEX "status_appliesTo_idx" ON "tax_rules" USING btree ("status","applies_to");
  CREATE INDEX "country_status_effectiveFrom_idx" ON "tax_rules" USING btree ("country","status","effective_from");
  CREATE INDEX "tax_rules_rels_order_idx" ON "tax_rules_rels" USING btree ("order");
  CREATE INDEX "tax_rules_rels_parent_idx" ON "tax_rules_rels" USING btree ("parent_id");
  CREATE INDEX "tax_rules_rels_path_idx" ON "tax_rules_rels" USING btree ("path");
  CREATE INDEX "tax_rules_rels_products_id_idx" ON "tax_rules_rels" USING btree ("products_id");
  CREATE INDEX "tax_rules_rels_categories_id_idx" ON "tax_rules_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_buyer_idx" ON "orders" USING btree ("buyer_id");
  CREATE INDEX "orders_order_status_idx" ON "orders" USING btree ("order_status");
  CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");
  CREATE INDEX "orders_currency_idx" ON "orders" USING btree ("currency");
  CREATE INDEX "orders_created_by_idx" ON "orders" USING btree ("created_by_id");
  CREATE INDEX "orders_updated_by_idx" ON "orders" USING btree ("updated_by_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "buyer_createdAt_1_idx" ON "orders" USING btree ("buyer_id","created_at");
  CREATE INDEX "orderStatus_createdAt_idx" ON "orders" USING btree ("order_status","created_at");
  CREATE INDEX "paymentStatus_createdAt_idx" ON "orders" USING btree ("payment_status","created_at");
  CREATE INDEX "buyer_orderStatus_createdAt_idx" ON "orders" USING btree ("buyer_id","order_status","created_at");
  CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");
  CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");
  CREATE INDEX "order_items_product_image_idx" ON "order_items" USING btree ("product_image_id");
  CREATE INDEX "order_items_order_status_idx" ON "order_items" USING btree ("order_status");
  CREATE INDEX "order_items_updated_at_idx" ON "order_items" USING btree ("updated_at");
  CREATE INDEX "order_items_created_at_idx" ON "order_items" USING btree ("created_at");
  CREATE INDEX "order_idx" ON "order_items" USING btree ("order_id");
  CREATE INDEX "product_idx" ON "order_items" USING btree ("product_id");
  CREATE INDEX "order_product_idx" ON "order_items" USING btree ("order_id","product_id");
  CREATE INDEX "order_orderStatus_idx" ON "order_items" USING btree ("order_id","order_status");
  CREATE INDEX "orderStatus_idx" ON "order_items" USING btree ("order_status");
  CREATE UNIQUE INDEX "transactions_reference_idx" ON "transactions" USING btree ("reference");
  CREATE INDEX "transactions_order_idx" ON "transactions" USING btree ("order_id");
  CREATE INDEX "transactions_customer_idx" ON "transactions" USING btree ("customer_id");
  CREATE INDEX "transactions_type_idx" ON "transactions" USING btree ("type");
  CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");
  CREATE INDEX "transactions_amount_idx" ON "transactions" USING btree ("amount");
  CREATE INDEX "transactions_currency_idx" ON "transactions" USING btree ("currency");
  CREATE INDEX "transactions_provider_idx" ON "transactions" USING btree ("provider");
  CREATE INDEX "transactions_provider_reference_idx" ON "transactions" USING btree ("provider_reference");
  CREATE INDEX "transactions_parent_transaction_idx" ON "transactions" USING btree ("parent_transaction_id");
  CREATE INDEX "transactions_created_by_idx" ON "transactions" USING btree ("created_by_id");
  CREATE INDEX "transactions_updated_by_idx" ON "transactions" USING btree ("updated_by_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE INDEX "order_createdAt_idx" ON "transactions" USING btree ("order_id","created_at");
  CREATE INDEX "customer_createdAt_idx" ON "transactions" USING btree ("customer_id","created_at");
  CREATE INDEX "provider_providerReference_idx" ON "transactions" USING btree ("provider","provider_reference");
  CREATE INDEX "type_status_createdAt_idx" ON "transactions" USING btree ("type","status","created_at");
  CREATE INDEX "parentTransaction_idx" ON "transactions" USING btree ("parent_transaction_id");
  CREATE INDEX "createdBy_createdAt_2_idx" ON "transactions" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "payments_order_reference_idx" ON "payments" USING btree ("order_reference");
  CREATE INDEX "payments_provider_reference_idx" ON "payments" USING btree ("provider_reference");
  CREATE UNIQUE INDEX "payments_order_idx" ON "payments" USING btree ("order_id");
  CREATE INDEX "payments_buyer_idx" ON "payments" USING btree ("buyer_id");
  CREATE INDEX "payments_provider_idx" ON "payments" USING btree ("provider");
  CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");
  CREATE INDEX "payments_created_by_idx" ON "payments" USING btree ("created_by_id");
  CREATE INDEX "payments_updated_by_idx" ON "payments" USING btree ("updated_by_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "order_1_idx" ON "payments" USING btree ("order_id");
  CREATE INDEX "buyer_createdAt_2_idx" ON "payments" USING btree ("buyer_id","created_at");
  CREATE INDEX "status_createdAt_idx" ON "payments" USING btree ("status","created_at");
  CREATE INDEX "provider_status_idx" ON "payments" USING btree ("provider","status");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_product_library_id_idx" ON "payload_locked_documents_rels" USING btree ("product_library_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_inventory_id_idx" ON "payload_locked_documents_rels" USING btree ("inventory_id");
  CREATE INDEX "payload_locked_documents_rels_tax_rules_id_idx" ON "payload_locked_documents_rels" USING btree ("tax_rules_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_order_items_id_idx" ON "payload_locked_documents_rels" USING btree ("order_items_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "product_library" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "inventory" CASCADE;
  DROP TABLE "tax_rules" CASCADE;
  DROP TABLE "tax_rules_rels" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "order_items" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_products_badges";
  DROP TYPE "public"."enum_products_product_type";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum_inventory_type";
  DROP TYPE "public"."enum_tax_rules_type";
  DROP TYPE "public"."enum_tax_rules_currency";
  DROP TYPE "public"."enum_tax_rules_country";
  DROP TYPE "public"."enum_tax_rules_applies_to";
  DROP TYPE "public"."enum_tax_rules_status";
  DROP TYPE "public"."enum_orders_order_status";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_order_items_product_type";
  DROP TYPE "public"."enum_order_items_order_status";
  DROP TYPE "public"."enum_transactions_type";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_currency";
  DROP TYPE "public"."enum_transactions_provider";
  DROP TYPE "public"."enum_payments_currency";
  DROP TYPE "public"."enum_payments_provider";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
