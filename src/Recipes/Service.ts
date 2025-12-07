import { Effect } from "effect";
import { RecipeNotFound } from "./Error";
import type { RecipeId } from "./Table";
import { RecipeRepository } from "./Repository";

export class RecipeService extends Effect.Service<RecipeService>()(
  "RecipeService",
  {
    dependencies: [RecipeRepository.Default],
    accessors: true,
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
        create: Effect.fn("RecipeService.create")(function* (spec: {
          title: string;
        }) {
          const recipe = yield* db.create(spec);
          return recipe.id;
        }),
      };
    }),
  },
) {}
