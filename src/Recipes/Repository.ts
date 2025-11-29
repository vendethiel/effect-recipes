import { Effect, HashMap, Layer, Option, Ref } from "effect";
import { Db, PgDbLive } from "src/Db";
import { Recipe, type RecipeId } from "src/Recipes/Model";
import { deserializeRecipe } from "./Table";

export class RecipeRepository extends Effect.Service<RecipeRepository>()(
  "RecipeRepository",
  {
    dependencies: [PgDbLive],
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
            Effect.map(deserializeRecipe)
          );
        }),
      };
    }),
  },
) {
  static readonly InMemory = Layer.effect(
    this,
    Effect.gen(function* (){
      const ref = yield* Ref.make(HashMap.empty<RecipeId, Recipe>());

      return RecipeRepository.make({
        list: Effect.fn("RecipeRepository.list")(function* (){
          return HashMap.toValues(yield* Ref.get(ref));
        }),
        get: Effect.fn("RecipeRepository.get")(function* (id: RecipeId) {
          return yield* HashMap.get(yield* Ref.get(ref), id);
        }),
      })
    })
  )
}
