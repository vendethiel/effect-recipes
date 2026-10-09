import { Config, Effect, Redacted, Schema } from "effect";
import * as Database from "effect-sql-kysely/Pg";
import * as kysely from "kysely";
import { Pool } from "pg";
import { Recipes } from "./Recipes/Table";
import { Users } from "./Users/Table";

export const DbSchema = Schema.Struct({
  recipes: Recipes,
  users: Users,
});

export type DbSchema = typeof DbSchema.Encoded;

export class Db extends Database.make<DbSchema, Db>("Db") {}

export const PgDbLive = Db.layer({
  acquire: Effect.gen(function* () {
    const config = {
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
      password: Redacted.value(
        yield* Config.redacted("DB_PASSWORD").pipe(
          Config.withDefault(Redacted.make("")),
        ),
      ),
    };
    return new kysely.Kysely<DbSchema>({
      dialect: new kysely.PostgresDialect({
        pool: new Pool(config),
      }),
    });
  }).pipe(Effect.acquireRelease((db) => Effect.promise(() => db.destroy()))),
  spanAttributes: [
    ["db.system", "pg"],
    ["db.app", "recipes"],
  ],
});
