CREATE TABLE "project" (
	"name" varchar NOT NULL,
	"id" serial NOT NULL,
	"json" varchar NOT NULL,
	CONSTRAINT project_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);