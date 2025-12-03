import { Effect, HashMap, Layer, Option, Ref } from "effect";
import { Db, PgDbLive } from "src/Db";
import type { Recipe } from "src/Recipes/Model";
import { RecipeId } from "src/Recipes/Model";
import type { RecipeNew } from "./Table";
import { deserializeRecipe } from "./Table";

const bigIntMax = (args: Array<bigint>) =>
  args.reduce((m, e) => (e > m ? e : m));

export class RecipeRepository extends Effect.Service<RecipeRepository>()(
  "RecipeRepository",
  {
    dependencies: [PgDbLive],
    accessors: true,
    effect: Effect.gen(function* () {
      const db = yield* Db;
      return {
        list: Effect.fn("RecipeRepository.list")(function* () {
          const rows = yield* db.selectFrom("recipe").selectAll();
          return rows.map(deserializeRecipe);
        }),
        get: Effect.fn("RecipeRepository.get")(function* (id: RecipeId) {
          const [row] = yield* db
            .selectFrom("recipe")
            .where("recipe.id", "=", id)
            .limit(1)
            .selectAll();
          return yield* Option.fromNullable(row).pipe(
            Effect.map(deserializeRecipe),
          );
        }),
        create: Effect.fn("RecipeRepository.create")(function* (
          spec: RecipeNew,
        ) {
          const [insert] = yield* Option.fromNullable(
            yield* db.insertInto("recipe").values(spec),
          );
          return yield* Option.fromNullable(insert?.insertId).pipe(
            Effect.map(RecipeId.make),
          );
        }),
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
          return yield* HashMap.get(yield* Ref.get(ref), id);
        }),
        create: Effect.fn("RecipeRepository.create")(function* (
          spec: RecipeNew,
        ) {
          const highest = bigIntMax([...HashMap.keys(yield* Ref.get(ref))]);
          const recipe: Recipe = { ...spec, id: RecipeId.make(highest + 1n) };
          yield* Ref.update(ref, HashMap.set(recipe.id, recipe));
          return recipe.id;
        }),
      });
    }),
  );
}
