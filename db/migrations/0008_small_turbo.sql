DROP INDEX IF EXISTS "address_id_timestamp_index";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'lp_reserveDatas'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "lp_reserveDatas" DROP CONSTRAINT "lp_reserveDatas_pkey";--> statement-breakpoint
ALTER TABLE "lp_reserveDatas" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lp_reserveDatas" ADD CONSTRAINT "address_id_timestamp_index" PRIMARY KEY("address","id","updateTimestamp");