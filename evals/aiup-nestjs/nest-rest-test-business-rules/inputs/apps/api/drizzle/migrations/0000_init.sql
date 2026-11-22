CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" double precision NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL
);
