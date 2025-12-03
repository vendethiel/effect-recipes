import { Effect } from "effect";
import { Db, PgDbLive } from "src/Db";
import { RecipeNotFound } from "./Error";
import { createRecipe, getRecipe, listRecipes } from "./Query";
import type { RecipeId } from "./Table";

export class RecipeService extends Effect.Service<RecipeService>()(
  "RecipeService",
  {
    dependencies: [PgDbLive],
    accessors: true,
    effect: Effect.gen(function* () {
      const db = yield* Db;

      return {
        list: Effect.fn("RecipeService.list")(function* () {
          return yield* listRecipes();
        }, Effect.provideService(Db, db)),
        get: Effect.fn("RecipeService.get")(function* (id: RecipeId) {
          const row = yield* getRecipe(id);
          return yield* row.pipe(
            Effect.catchTag("NoSuchElementException", () =>
              RecipeNotFound.make({ id }),
            ),
          );
        }, Effect.provideService(Db, db)),
        create: Effect.fn("RecipeService.create")(function* (spec: {
          title: string;
        }) {
          const recipe = yield* createRecipe(spec);
          return recipe.id;
        },
        Effect.provideService(Db, db)),
      };
    }),
  },
) {}

/*

const bigIntMax = (args: Array<bigint>) =>
  args.reduce((m, e) => (e > m ? e : m));

static readonly InMemory = Layer.effect(
    this,
    Effect.gen(function* () {
      const ref = yield* Ref.make(HashMap.empty<RecipeId, Recipe>());

      return RecipeService.make({
        list: Effect.fn("RecipeService.list")(function* () {
          return HashMap.toValues(yield* Ref.get(ref));
        }),
        get: Effect.fn("RecipeService.get")(function* (id: RecipeId) {
          return yield* HashMap.get(yield* Ref.get(ref), id);
        }),
        create: Effect.fn("RecipeService.create")(function* (
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
  */
