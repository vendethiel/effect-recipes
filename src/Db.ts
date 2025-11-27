import * as PgKysely from "@effect/sql-kysely/Pg";
import { PgClient } from "@effect/sql-pg";
import { Config, Context, Effect, Layer, Redacted } from "effect";
import type { RecipeTable } from "./Recipes/Table";

export class DbConfig extends Effect.Service<DbConfig>()("DbConfig", {
  effect: Effect.gen(function* () {
    return {
      host: yield* Config.string("DB_HOST").pipe(
        Config.withDefault("localhost"),
      ),
      port: yield* Config.integer("DB_PORT").pipe(Config.withDefault(5432)),
      database: yield* Config.string("DB_NAME").pipe(
        Config.withDefault("recipes"),
      ),
      username: yield* Config.string("DB_USERNAME").pipe(
        Config.withDefault("postgres"),
      ),
      password: yield* Config.redacted("DB_PASSWORD").pipe(
        Config.withDefault(Redacted.make("postgres")),
      ),
      ssl: yield* Config.boolean("DB_SSL").pipe(Config.withDefault(false)),
    };
  }),
}) {}

export class DbClient extends Effect.Service<DbClient>()("DbClient", {
  dependencies: [DbConfig.Default],
  scoped: Effect.gen(function* () {
    const config = yield* DbConfig;
    return yield* PgClient.make(config);
  }),
}) {}

interface Database {
  recipe: RecipeTable;
}

export class Db extends Context.Tag("Db")<
  Db,
  PgKysely.EffectKysely<Database>
>() {}

export const PgDbLive = Layer.effect(Db, PgKysely.make<Database>()).pipe(
  Layer.provide(DbClient.Default),
);
