import { promises as fs } from "fs";
import * as path from "path";
import { Console } from "effect";
import { NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect/index";
import { Db, PgDbLive } from "./Db";
import { Migrator } from "kysely";
import { FileMigrationProvider, type MigrationResult } from "kysely";

Effect.gen(function*() {
  const db = yield* Db;
  const migrator = new Migrator({
    db: db as any,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../migrations")
    })
  });
  const {error, results} = yield* Effect.promise(() => migrator.migrateToLatest());
  yield* Effect.forEach(results ?? [], (result: MigrationResult) =>
    result.status === "Success"
      ? Console.info(`Migration ${result.migrationName} succeeded`)
      : Console.error(`Migration ${result.migrationName} failed (${result.status})`)
  );
  if (error) {
    return yield* Effect.die(new Error("Failed to migrate"));
  }
}).pipe(Effect.provide(PgDbLive), NodeRuntime.runMain);
