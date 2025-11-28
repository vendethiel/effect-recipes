import * as PgKysely from "@effect/sql-kysely/Pg";
import { PgClient } from "@effect/sql-pg";
import { Config, Context, Layer, Redacted } from "effect";
import type { RecipeTable } from "./Recipes/Table";

export const PgLive = PgClient.layerConfig({
  host: Config.string("DB_HOST").pipe(
    Config.withDefault("localhost"),
  ),
  port: Config.integer("DB_PORT").pipe(Config.withDefault(5432)),
  database: Config.string("DB_NAME").pipe(
    Config.withDefault("recipes"),
  ),
  username: Config.string("DB_USERNAME").pipe(
    Config.withDefault("postgres"),
  ),
  password: Config.redacted("DB_PASSWORD").pipe(
    Config.withDefault(Redacted.make("postgres")),
  ),
})

interface Database {
  recipe: RecipeTable;
}

export class Db extends Context.Tag("Db")<
Db,
PgKysely.EffectKysely<Database>
>() {}

export const PgDbLive = Layer.effect(Db, PgKysely.make<Database>()).pipe(
  Layer.provide(PgLive),
);
