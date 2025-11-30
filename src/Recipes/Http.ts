import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { Api } from "src/Api";
import { RecipeNotFound, RecipeCreationError } from "src/Recipes/Model";
import { RecipeRepository } from "./Repository";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    Effect.gen(function* () {
      return handlers
        .handle(
          "list",
          () => RecipeRepository.list().pipe(Effect.orDie))
        .handle(
          "get",
          ({ path: { id } }) => RecipeRepository.get(id).pipe(
            Effect.catchTag(
              "NoSuchElementException",
              () => RecipeNotFound.make({ id })
            ),
            Effect.orDie,
          ),
        )
        .handle(
          "create",
          ({ payload }) =>
            // TODO auth
            RecipeRepository.create(payload).pipe(
              Effect.catchTag(
                "NoSuchElementException",
                () => RecipeCreationError.make()
              ),
              Effect.orDie
            )
        );
    }),
).pipe(Layer.provide([
  RecipeRepository.Default
]));
