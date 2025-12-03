import { Config, Effect, Schema } from "effect";
import * as Database from "effect-sql-kysely/Pg";
import * as kysely from "kysely";
import { Pool } from "pg";
import { Recipes } from "./Recipes/Table";

export const DbSchema = Schema.Struct({
  recipes: Recipes,
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
      // XXX redacted?
      password: yield* Config.string("DB_PASSWORD").pipe(
        Config.withDefault("postgres"),
      ),
    };
    return new kysely.Kysely<DbSchema>({
      dialect: new kysely.PostgresDialect({
        pool: new Pool(config),
      }),
    });
  }),
});
