import { Effect, Option } from "effect";
import { DbClient } from "src/Db";
import type { Recipe, RecipeId } from "src/Recipes/Model";
import { deserializeUnknownRecipe } from "./DTO";

export class RecipeRepository extends Effect.Service<RecipeRepository>()(
  "RecipeRepository",
  {
    dependencies: [DbClient.Default],
    effect: Effect.gen(function* () {
      const db = yield* DbClient;
      return {
        list: Effect.fn("RecipeRepository.list")(function* () {
          const rows = yield* db`SELECT id, title FROM recipe`;
          return yield* Effect.all(rows.map(deserializeUnknownRecipe));
        }),
        get: Effect.fn("RecipeRepository.get")(function* (id: RecipeId) {
          const [row] =
            yield* db` SELECT id, title FROM recipe WHERE id = ${id}`;
          if (row)
            return yield* deserializeUnknownRecipe(row).pipe(
              Effect.map(Option.some),
            );
          else return Option.none<Recipe>;
        }),
      };
    }),
  },
) {}
