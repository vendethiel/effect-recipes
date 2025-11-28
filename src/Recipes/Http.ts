import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { Api } from "src/Api";
import { RecipeNotFound } from "src/Recipes/Model";
import { RecipeRepository } from "./Repository";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    Effect.gen(function* () {
      const repo = yield* RecipeRepository;
      return handlers
        .handle(
          "list",
          () => repo.list().pipe(Effect.orDie))
        .handle(
          "get",
          ({ path: { id } }) => repo.get(id).pipe(
            Effect.catchTag(
              "NoSuchElementException",
              () => RecipeNotFound.make({ id })
            ),
            Effect.orDie,
          ),
        );
    }),
).pipe(Layer.provide([
  RecipeRepository.Default
]));
