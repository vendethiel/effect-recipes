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
