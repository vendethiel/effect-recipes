import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { Api } from "src/Api";
import { RecipeService } from "./Service";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    Effect.succeed(
      handlers
        .handle("list", () =>
          RecipeService.list().pipe(
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("get", ({ path: { id } }) =>
          RecipeService.get(id).pipe(
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("create", ({ payload }) =>
          RecipeService.create(payload).pipe(
            Effect.catchTag("SqlError", "ParseError", "NoSuchElementException", Effect.die),
          ),
        ),
    ),
).pipe(Layer.provide([RecipeService.Default]));
