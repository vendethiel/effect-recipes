import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { Api } from "src/Api";
import { RecipeService } from "./Service";
import { CurrentUser } from "src/Platform/CurrentUser";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    Effect.succeed(
      handlers
        .handle("list", () =>
          RecipeService.list().pipe(
            // XXX Would it be better as ensureErrorType()+orDie?
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
            Effect.catchTag(
              "SqlError",
              "ParseError",
              "NoSuchElementException",
              Effect.die,
            ),
          ),
        )
        .handle("byAuthor", ({ path: { author } }) =>
          RecipeService.byAuthor(author).pipe(
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("mine", () =>
          Effect.gen(function* () {
            const currentUser = yield* CurrentUser;
            return yield* RecipeService.byAuthor(currentUser.id);
          }).pipe(Effect.catchTag("SqlError", "ParseError", Effect.die)),
        ),
    ),
).pipe(Layer.provide([RecipeService.Default]));
