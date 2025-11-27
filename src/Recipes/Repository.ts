import { Effect, Option } from "effect";
import { Db, PgDbLive } from "src/Db";
import { Recipe, type RecipeId } from "src/Recipes/Model";
import { deserializeUnknownRecipe } from "./DTO";

export class RecipeRepository extends Effect.Service<RecipeRepository>()(
  "RecipeRepository",
  {
    dependencies: [PgDbLive],
    effect: Effect.gen(function* () {
      const db = yield* Db;
      return {
        list: Effect.fn("RecipeRepository.list")(function* () {
          const rows = yield* Effect.tryPromise(() =>
            db.selectFrom("recipe").selectAll().execute(),
          );
          return rows.map(Recipe.make);
        }),
        get: Effect.fn("RecipeRepository.get")(function* (id: RecipeId) {
          const row = yield* Effect.promise(() =>
            db
              .selectFrom("recipe")
              .where("recipe.id", "=", id)
              .selectAll()
              .executeTakeFirst(),
          );
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
