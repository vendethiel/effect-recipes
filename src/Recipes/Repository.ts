import { Effect, Option } from "effect";
import { Db, PgDbLive } from "src/Db";
import { type RecipeId } from "src/Recipes/Model";
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
  //   static Test = this.DefaultWithoutDependencies.pipe(Layer.provide());
}
