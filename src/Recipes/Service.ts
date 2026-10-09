import { Effect } from "effect";
import { RecipeNotFound } from "./Error";
import type { RecipeId, RecipeCreate } from "./Table";
import { RecipeRepository } from "./Repository";
import type { UserId } from "src/Users/Table";

export class RecipeService extends Effect.Service<RecipeService>()(
  "RecipeService",
  {
    dependencies: [],
    effect: Effect.gen(function* () {
      const db = yield* RecipeRepository;

      return {
        list: Effect.fn("RecipeService.list")(function* () {
          return yield* db.list();
        }),
        get: Effect.fn("RecipeService.get")(function* (id: RecipeId) {
          const row = yield* db.get(id);
          return yield* row.pipe(
            Effect.catchTag("NoSuchElementException", () =>
              RecipeNotFound.make({ id }),
            ),
          );
        }),
        create: Effect.fn("RecipeService.create")(function* (spec: RecipeCreate) {
          const recipe = yield* db.create(spec);
          return recipe.id;
        }),
        byAuthor: Effect.fn("RecipeService.byAuthor")(function* (
          author: UserId,
        ) {
          return yield* db.byAuthor(author);
        }),
      };
    }),
  },
) {}
