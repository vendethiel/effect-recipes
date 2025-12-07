import { Effect, HashMap, Layer, Ref, Schema } from "effect";
import { makeSchema } from "effect-sql-kysely";
import { Db, PgDbLive } from "src/Db";
import { type Recipe, type RecipeSpec, RecipeId, Recipes } from "./Table";

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
) {
  static readonly InMemory = Layer.effect(
    this,
    Effect.gen(function* () {
      const ref = yield* Ref.make(HashMap.empty<RecipeId, Recipe>());

      return RecipeRepository.make({
        list: Effect.fn("RecipeRepository.list")(function* () {
          return HashMap.toValues(yield* Ref.get(ref));
        }),
        get: Effect.fn("RecipeRepository.get")(function* (id: RecipeId) {
          return HashMap.get(yield* Ref.get(ref), id);
        }),
        create: Effect.fn("RecipeRepository.create")(function* (
          spec: RecipeSpec,
        ) {
          const highest = Math.max(...HashMap.keys(yield* Ref.get(ref)));
          const recipe: Recipe = {
            ...spec,
            id: RecipeId.make(highest + 1),
          };
          yield* Ref.update(ref, HashMap.set(recipe.id, recipe));
          return recipe;
        }),
      });
    }),
  );
}
