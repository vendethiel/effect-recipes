import { Effect, Schema } from "effect";
import { makeSchema } from "effect-sql-kysely";
import { Db, PgDbLive } from "src/Db";
import { Recipes } from "./Table";

export class RecipeRepository extends Effect.Service<RecipeRepository>()(
  "RecipeRepository",
  {
    dependencies: [PgDbLive],
    effect: Effect.gen(function* () {
      const { kysely } = yield* Db;
      const { findAll, findOne, single } = makeSchema(kysely);
      return {
        list: Effect.fn("RecipeRepository.list")(
          findAll({
            Request: Schema.Void,
            Result: Recipes.select,
            execute: (db) => db.selectFrom("recipes").selectAll(),
          }),
        ),
        get: Effect.fn("RecipeRepository.get")(
          findOne({
            Request: Recipes.select.fields.id,
            Result: Recipes.select,
            execute: (db, id) =>
              db.selectFrom("recipes").where("id", "=", id).selectAll(),
          }),
        ),
        create: Effect.fn("RecipeRepository.create")(
          single({
            Request: Recipes.insert,
            Result: Recipes.select,
            execute: (db, spec) =>
              db.insertInto("recipes").values(spec).returningAll(),
          }),
        ),
      };
    }),
  },
) {}
