import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'customer');
  CREATE TYPE "public"."enum_products_badges" AS ENUM('best_seller', 'featured', 'new', 'trending');
  CREATE TYPE "public"."enum_products_status" AS ENUM('active', 'draft', 'inactive', 'archived');
  CREATE TYPE "public"."enum_products_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_order_items_product_type" AS ENUM('product', 'gift', 'sim');
  CREATE TYPE "public"."enum_order_items_sim_type" AS ENUM('esim', 'physical');
  CREATE TYPE "public"."enum_order_items_fulfillment_status" AS ENUM('pending', 'partial', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_transactions_type" AS ENUM('payment', 'refund', 'chargeback');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('pending', 'successful', 'failed', 'cancelled');
  CREATE TYPE "public"."enum_transactions_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_transactions_provider" AS ENUM('transactpay');
  CREATE TYPE "public"."enum_payments_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_payments_provider" AS ENUM('transactpay');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'successful', 'failed', 'refunded');
  CREATE TYPE "public"."enum_product_secrets_status" AS ENUM('available', 'sold');
  CREATE TYPE "public"."enum_gifts_status" AS ENUM('active', 'draft', 'inactive', 'archived');
  CREATE TYPE "public"."enum_gifts_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_sims_badges" AS ENUM('best_seller', 'featured', 'new', 'trending');
  CREATE TYPE "public"."enum_sims_sim_type" AS ENUM('esim', 'physical');
  CREATE TYPE "public"."enum_sims_status" AS ENUM('active', 'draft', 'inactive', 'archived');
  CREATE TYPE "public"."enum_sims_currency" AS ENUM('NGN');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sendWelcomeEmail', 'verifyPayment', 'deliverOrder', 'validateOrder');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_workflow_slug" AS ENUM('processPaymentWebhook');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sendWelcomeEmail', 'verifyPayment', 'deliverOrder', 'validateOrder');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'customer',
  	"full_name" varchar NOT NULL,
  	"avatar_id" uuid,
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
  	"id" uuid PRIMARY KEY NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
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
  	"parent_id" uuid NOT NULL,
  	"value" "enum_products_badges",
  	"id" uuid PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"product_image_id" uuid NOT NULL,
  	"status" "enum_products_status" DEFAULT 'active' NOT NULL,
  	"stock" numeric DEFAULT 0 NOT NULL,
  	"virtual_stock" numeric DEFAULT 0 NOT NULL,
  	"price_kobo" numeric NOT NULL,
  	"category_id" uuid NOT NULL,
  	"slug" varchar NOT NULL,
  	"currency" "enum_products_currency" DEFAULT 'NGN' NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"parent_id" uuid,
  	"status" "enum_categories_status" DEFAULT 'active' NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"buyer_id" uuid NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"currency" "enum_orders_currency" DEFAULT 'NGN' NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"total" numeric NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"shipping_address_full_name" varchar,
  	"shipping_address_address_line1" varchar,
  	"shipping_address_address_line2" varchar,
  	"shipping_address_city" varchar,
  	"shipping_address_state" varchar,
  	"shipping_address_postal_code" varchar,
  	"shipping_address_country" varchar,
  	"delivery_instructions" varchar,
  	"internal_notes" varchar,
  	"created_by_id" uuid,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "order_items_secrets" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"secret" varchar
  );
  
  CREATE TABLE "order_items" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"order_id" uuid NOT NULL,
  	"product_id" uuid,
  	"gift_id" uuid,
  	"sim_id" uuid,
  	"product_type" "enum_order_items_product_type" NOT NULL,
  	"sim_type" "enum_order_items_sim_type",
  	"product_name" varchar NOT NULL,
  	"product_image_id" uuid,
  	"unit_price" numeric NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"line_total" numeric NOT NULL,
  	"fulfillment_status" "enum_order_items_fulfillment_status" DEFAULT 'pending' NOT NULL,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"order_id" uuid NOT NULL,
  	"customer_id" uuid NOT NULL,
  	"type" "enum_transactions_type" NOT NULL,
  	"status" "enum_transactions_status" DEFAULT 'pending' NOT NULL,
  	"payment_id" uuid,
  	"idempotency_key" varchar,
  	"amount" numeric NOT NULL,
  	"currency" "enum_transactions_currency" DEFAULT 'NGN' NOT NULL,
  	"provider" "enum_transactions_provider" NOT NULL,
  	"provider_reference" varchar,
  	"provider_response" jsonb,
  	"parent_transaction_id" uuid,
  	"failure_code" varchar,
  	"failure_message" varchar,
  	"description" varchar,
  	"created_by_id" uuid,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"order_reference" varchar NOT NULL,
  	"checkout_url" varchar,
  	"provider_reference" varchar,
  	"provider_fee" numeric,
  	"total_amount_charged" numeric,
  	"order_id" uuid NOT NULL,
  	"buyer_id" uuid NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" "enum_payments_currency" DEFAULT 'NGN' NOT NULL,
  	"provider" "enum_payments_provider" DEFAULT 'transactpay' NOT NULL,
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"paid_at" timestamp(3) with time zone,
  	"refunded_at" timestamp(3) with time zone,
  	"metadata" jsonb,
  	"created_by_id" uuid,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "avatars" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"user_id" uuid NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"prefix" varchar DEFAULT 'avatars',
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
  
  CREATE TABLE "product_secrets" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"secret" varchar NOT NULL,
  	"product_id" uuid NOT NULL,
  	"status" "enum_product_secrets_status" DEFAULT 'available' NOT NULL,
  	"sold_at" timestamp(3) with time zone,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gifts" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"product_image_id" uuid NOT NULL,
  	"status" "enum_gifts_status" DEFAULT 'active' NOT NULL,
  	"stock" numeric DEFAULT 0 NOT NULL,
  	"price_kobo" numeric NOT NULL,
  	"category_id" uuid NOT NULL,
  	"currency" "enum_gifts_currency" DEFAULT 'NGN' NOT NULL,
  	"slug" varchar NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sims_badges" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_sims_badges",
  	"id" uuid PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "sims" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"product_image_id" uuid NOT NULL,
  	"sim_type" "enum_sims_sim_type" DEFAULT 'physical' NOT NULL,
  	"status" "enum_sims_status" DEFAULT 'active' NOT NULL,
  	"stock" numeric DEFAULT 0 NOT NULL,
  	"virtual_stock" numeric DEFAULT 0 NOT NULL,
  	"price_kobo" numeric NOT NULL,
  	"category_id" uuid,
  	"country_id" uuid NOT NULL,
  	"currency" "enum_sims_currency" DEFAULT 'NGN' NOT NULL,
  	"slug" varchar NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "countries" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"created_by_id" uuid NOT NULL,
  	"updated_by_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
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
  	"id" uuid PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"workflow_slug" "enum_payload_jobs_workflow_slug",
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"concurrency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"product_library_id" uuid,
  	"products_id" uuid,
  	"categories_id" uuid,
  	"orders_id" uuid,
  	"order_items_id" uuid,
  	"transactions_id" uuid,
  	"payments_id" uuid,
  	"avatars_id" uuid,
  	"product_secrets_id" uuid,
  	"gifts_id" uuid,
  	"sims_id" uuid,
  	"countries_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_avatars_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."avatars"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_library" ADD CONSTRAINT "product_library_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items_secrets" ADD CONSTRAINT "order_items_secrets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_gift_id_gifts_id_fk" FOREIGN KEY ("gift_id") REFERENCES "public"."gifts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_sim_id_sims_id_fk" FOREIGN KEY ("sim_id") REFERENCES "public"."sims"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_parent_transaction_id_transactions_id_fk" FOREIGN KEY ("parent_transaction_id") REFERENCES "public"."transactions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "avatars" ADD CONSTRAINT "avatars_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_secrets" ADD CONSTRAINT "product_secrets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_secrets" ADD CONSTRAINT "product_secrets_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_secrets" ADD CONSTRAINT "product_secrets_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gifts" ADD CONSTRAINT "gifts_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sims_badges" ADD CONSTRAINT "sims_badges_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sims" ADD CONSTRAINT "sims_product_image_id_product_library_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_library"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sims" ADD CONSTRAINT "sims_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sims" ADD CONSTRAINT "sims_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sims" ADD CONSTRAINT "sims_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sims" ADD CONSTRAINT "sims_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "countries" ADD CONSTRAINT "countries_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_library_fk" FOREIGN KEY ("product_library_id") REFERENCES "public"."product_library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_order_items_fk" FOREIGN KEY ("order_items_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_avatars_fk" FOREIGN KEY ("avatars_id") REFERENCES "public"."avatars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_secrets_fk" FOREIGN KEY ("product_secrets_id") REFERENCES "public"."product_secrets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gifts_fk" FOREIGN KEY ("gifts_id") REFERENCES "public"."gifts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sims_fk" FOREIGN KEY ("sims_id") REFERENCES "public"."sims"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_countries_fk" FOREIGN KEY ("countries_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "product_library_created_by_idx" ON "product_library" USING btree ("created_by_id");
  CREATE INDEX "product_library_updated_by_idx" ON "product_library" USING btree ("updated_by_id");
  CREATE INDEX "product_library_updated_at_idx" ON "product_library" USING btree ("updated_at");
  CREATE INDEX "product_library_created_at_idx" ON "product_library" USING btree ("created_at");
  CREATE UNIQUE INDEX "product_library_filename_idx" ON "product_library" USING btree ("filename");
  CREATE INDEX "product_library_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "product_library" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "product_library_sizes_card_sizes_card_filename_idx" ON "product_library" USING btree ("sizes_card_filename");
  CREATE INDEX "product_library_sizes_large_sizes_large_filename_idx" ON "product_library" USING btree ("sizes_large_filename");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("order");
  CREATE INDEX "products_badges_parent_idx" ON "products_badges" USING btree ("parent_id");
  CREATE INDEX "products_product_image_idx" ON "products" USING btree ("product_image_id");
  CREATE INDEX "products_status_idx" ON "products" USING btree ("status");
  CREATE INDEX "products_stock_idx" ON "products" USING btree ("stock");
  CREATE INDEX "products_virtual_stock_idx" ON "products" USING btree ("virtual_stock");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_currency_idx" ON "products" USING btree ("currency");
  CREATE INDEX "products_created_by_idx" ON "products" USING btree ("created_by_id");
  CREATE INDEX "products_updated_by_idx" ON "products" USING btree ("updated_by_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "status_priceKobo_idx" ON "products" USING btree ("status","price_kobo");
  CREATE INDEX "category_status_idx" ON "products" USING btree ("category_id","status");
  CREATE INDEX "createdBy_createdAt_idx" ON "products" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");
  CREATE INDEX "categories_created_by_idx" ON "categories" USING btree ("created_by_id");
  CREATE INDEX "categories_updated_by_idx" ON "categories" USING btree ("updated_by_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "status_parent_idx" ON "categories" USING btree ("status","parent_id");
  CREATE INDEX "createdBy_createdAt_1_idx" ON "categories" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "orders_reference_idx" ON "orders" USING btree ("reference");
  CREATE INDEX "orders_buyer_idx" ON "orders" USING btree ("buyer_id");
  CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
  CREATE INDEX "orders_currency_idx" ON "orders" USING btree ("currency");
  CREATE INDEX "orders_created_by_idx" ON "orders" USING btree ("created_by_id");
  CREATE INDEX "orders_updated_by_idx" ON "orders" USING btree ("updated_by_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "buyer_createdAt_idx" ON "orders" USING btree ("buyer_id","created_at");
  CREATE INDEX "status_createdAt_idx" ON "orders" USING btree ("status","created_at");
  CREATE INDEX "buyer_status_createdAt_idx" ON "orders" USING btree ("buyer_id","status","created_at");
  CREATE INDEX "order_items_secrets_order_idx" ON "order_items_secrets" USING btree ("_order");
  CREATE INDEX "order_items_secrets_parent_id_idx" ON "order_items_secrets" USING btree ("_parent_id");
  CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");
  CREATE INDEX "order_items_product_idx" ON "order_items" USING btree ("product_id");
  CREATE INDEX "order_items_gift_idx" ON "order_items" USING btree ("gift_id");
  CREATE INDEX "order_items_sim_idx" ON "order_items" USING btree ("sim_id");
  CREATE INDEX "order_items_product_image_idx" ON "order_items" USING btree ("product_image_id");
  CREATE INDEX "order_items_fulfillment_status_idx" ON "order_items" USING btree ("fulfillment_status");
  CREATE INDEX "order_items_updated_at_idx" ON "order_items" USING btree ("updated_at");
  CREATE INDEX "order_items_created_at_idx" ON "order_items" USING btree ("created_at");
  CREATE INDEX "order_idx" ON "order_items" USING btree ("order_id");
  CREATE INDEX "product_idx" ON "order_items" USING btree ("product_id");
  CREATE INDEX "gift_idx" ON "order_items" USING btree ("gift_id");
  CREATE INDEX "sim_idx" ON "order_items" USING btree ("sim_id");
  CREATE INDEX "order_product_idx" ON "order_items" USING btree ("order_id","product_id");
  CREATE INDEX "order_gift_idx" ON "order_items" USING btree ("order_id","gift_id");
  CREATE INDEX "order_sim_idx" ON "order_items" USING btree ("order_id","sim_id");
  CREATE INDEX "order_fulfillmentStatus_idx" ON "order_items" USING btree ("order_id","fulfillment_status");
  CREATE INDEX "fulfillmentStatus_idx" ON "order_items" USING btree ("fulfillment_status");
  CREATE UNIQUE INDEX "transactions_reference_idx" ON "transactions" USING btree ("reference");
  CREATE INDEX "transactions_order_idx" ON "transactions" USING btree ("order_id");
  CREATE INDEX "transactions_customer_idx" ON "transactions" USING btree ("customer_id");
  CREATE INDEX "transactions_type_idx" ON "transactions" USING btree ("type");
  CREATE INDEX "transactions_status_idx" ON "transactions" USING btree ("status");
  CREATE INDEX "transactions_payment_idx" ON "transactions" USING btree ("payment_id");
  CREATE UNIQUE INDEX "transactions_idempotency_key_idx" ON "transactions" USING btree ("idempotency_key");
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
  CREATE INDEX "buyer_createdAt_1_idx" ON "payments" USING btree ("buyer_id","created_at");
  CREATE INDEX "status_createdAt_1_idx" ON "payments" USING btree ("status","created_at");
  CREATE INDEX "provider_status_idx" ON "payments" USING btree ("provider","status");
  CREATE UNIQUE INDEX "avatars_user_idx" ON "avatars" USING btree ("user_id");
  CREATE INDEX "avatars_created_by_idx" ON "avatars" USING btree ("created_by_id");
  CREATE INDEX "avatars_updated_by_idx" ON "avatars" USING btree ("updated_by_id");
  CREATE INDEX "avatars_updated_at_idx" ON "avatars" USING btree ("updated_at");
  CREATE INDEX "avatars_created_at_idx" ON "avatars" USING btree ("created_at");
  CREATE UNIQUE INDEX "avatars_filename_idx" ON "avatars" USING btree ("filename");
  CREATE INDEX "avatars_sizes_small_sizes_small_filename_idx" ON "avatars" USING btree ("sizes_small_filename");
  CREATE INDEX "avatars_sizes_medium_sizes_medium_filename_idx" ON "avatars" USING btree ("sizes_medium_filename");
  CREATE INDEX "avatars_sizes_large_sizes_large_filename_idx" ON "avatars" USING btree ("sizes_large_filename");
  CREATE INDEX "product_secrets_product_idx" ON "product_secrets" USING btree ("product_id");
  CREATE INDEX "product_secrets_status_idx" ON "product_secrets" USING btree ("status");
  CREATE INDEX "product_secrets_sold_at_idx" ON "product_secrets" USING btree ("sold_at");
  CREATE INDEX "product_secrets_created_by_idx" ON "product_secrets" USING btree ("created_by_id");
  CREATE INDEX "product_secrets_updated_by_idx" ON "product_secrets" USING btree ("updated_by_id");
  CREATE INDEX "product_secrets_updated_at_idx" ON "product_secrets" USING btree ("updated_at");
  CREATE INDEX "product_secrets_created_at_idx" ON "product_secrets" USING btree ("created_at");
  CREATE INDEX "gifts_product_image_idx" ON "gifts" USING btree ("product_image_id");
  CREATE INDEX "gifts_status_idx" ON "gifts" USING btree ("status");
  CREATE INDEX "gifts_category_idx" ON "gifts" USING btree ("category_id");
  CREATE INDEX "gifts_currency_idx" ON "gifts" USING btree ("currency");
  CREATE UNIQUE INDEX "gifts_slug_idx" ON "gifts" USING btree ("slug");
  CREATE INDEX "gifts_created_by_idx" ON "gifts" USING btree ("created_by_id");
  CREATE INDEX "gifts_updated_by_idx" ON "gifts" USING btree ("updated_by_id");
  CREATE INDEX "gifts_updated_at_idx" ON "gifts" USING btree ("updated_at");
  CREATE INDEX "gifts_created_at_idx" ON "gifts" USING btree ("created_at");
  CREATE INDEX "category_status_1_idx" ON "gifts" USING btree ("category_id","status");
  CREATE INDEX "status_priceKobo_1_idx" ON "gifts" USING btree ("status","price_kobo");
  CREATE INDEX "createdBy_createdAt_3_idx" ON "gifts" USING btree ("created_by_id","created_at");
  CREATE INDEX "sims_badges_order_idx" ON "sims_badges" USING btree ("order");
  CREATE INDEX "sims_badges_parent_idx" ON "sims_badges" USING btree ("parent_id");
  CREATE INDEX "sims_product_image_idx" ON "sims" USING btree ("product_image_id");
  CREATE INDEX "sims_status_idx" ON "sims" USING btree ("status");
  CREATE INDEX "sims_virtual_stock_idx" ON "sims" USING btree ("virtual_stock");
  CREATE INDEX "sims_category_idx" ON "sims" USING btree ("category_id");
  CREATE INDEX "sims_country_idx" ON "sims" USING btree ("country_id");
  CREATE INDEX "sims_currency_idx" ON "sims" USING btree ("currency");
  CREATE UNIQUE INDEX "sims_slug_idx" ON "sims" USING btree ("slug");
  CREATE INDEX "sims_created_by_idx" ON "sims" USING btree ("created_by_id");
  CREATE INDEX "sims_updated_by_idx" ON "sims" USING btree ("updated_by_id");
  CREATE INDEX "sims_updated_at_idx" ON "sims" USING btree ("updated_at");
  CREATE INDEX "sims_created_at_idx" ON "sims" USING btree ("created_at");
  CREATE INDEX "category_status_2_idx" ON "sims" USING btree ("category_id","status");
  CREATE INDEX "status_priceKobo_2_idx" ON "sims" USING btree ("status","price_kobo");
  CREATE INDEX "createdBy_createdAt_4_idx" ON "sims" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "countries_name_idx" ON "countries" USING btree ("name");
  CREATE UNIQUE INDEX "countries_slug_idx" ON "countries" USING btree ("slug");
  CREATE INDEX "countries_created_by_idx" ON "countries" USING btree ("created_by_id");
  CREATE INDEX "countries_updated_by_idx" ON "countries" USING btree ("updated_by_id");
  CREATE INDEX "countries_updated_at_idx" ON "countries" USING btree ("updated_at");
  CREATE INDEX "countries_created_at_idx" ON "countries" USING btree ("created_at");
  CREATE INDEX "createdBy_createdAt_5_idx" ON "countries" USING btree ("created_by_id","created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_workflow_slug_idx" ON "payload_jobs" USING btree ("workflow_slug");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
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
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_order_items_id_idx" ON "payload_locked_documents_rels" USING btree ("order_items_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_avatars_id_idx" ON "payload_locked_documents_rels" USING btree ("avatars_id");
  CREATE INDEX "payload_locked_documents_rels_product_secrets_id_idx" ON "payload_locked_documents_rels" USING btree ("product_secrets_id");
  CREATE INDEX "payload_locked_documents_rels_gifts_id_idx" ON "payload_locked_documents_rels" USING btree ("gifts_id");
  CREATE INDEX "payload_locked_documents_rels_sims_id_idx" ON "payload_locked_documents_rels" USING btree ("sims_id");
  CREATE INDEX "payload_locked_documents_rels_countries_id_idx" ON "payload_locked_documents_rels" USING btree ("countries_id");
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
  DROP TABLE "orders" CASCADE;
  DROP TABLE "order_items_secrets" CASCADE;
  DROP TABLE "order_items" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "avatars" CASCADE;
  DROP TABLE "product_secrets" CASCADE;
  DROP TABLE "gifts" CASCADE;
  DROP TABLE "sims_badges" CASCADE;
  DROP TABLE "sims" CASCADE;
  DROP TABLE "countries" CASCADE;
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
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_products_currency";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_order_items_product_type";
  DROP TYPE "public"."enum_order_items_sim_type";
  DROP TYPE "public"."enum_order_items_fulfillment_status";
  DROP TYPE "public"."enum_transactions_type";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_currency";
  DROP TYPE "public"."enum_transactions_provider";
  DROP TYPE "public"."enum_payments_currency";
  DROP TYPE "public"."enum_payments_provider";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_product_secrets_status";
  DROP TYPE "public"."enum_gifts_status";
  DROP TYPE "public"."enum_gifts_currency";
  DROP TYPE "public"."enum_sims_badges";
  DROP TYPE "public"."enum_sims_sim_type";
  DROP TYPE "public"."enum_sims_status";
  DROP TYPE "public"."enum_sims_currency";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_workflow_slug";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
