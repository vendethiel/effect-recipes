import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("token", "varchar", (col) => col.notNull().unique())
    .execute();
  await db.schema
    .createTable("recipes")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull().unique())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("author", "integer", (col) => col.references("users.id"))
    .execute();
}

export async function down(db: Kysely<unknown>) {
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("recipes").execute();
}
