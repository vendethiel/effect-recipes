import { HttpApiBuilder } from "@effect/platform";
import { Effect, Layer } from "effect";
import { Api } from "src/Api";
import { RecipeService } from "./Service";
import { CurrentUser } from "src/Auth/CurrentUser";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    Effect.succeed(
      handlers
        .handle("list", () =>
          RecipeService.use((s) => s.list()).pipe(
            // XXX Would it be better as ensureErrorType()+orDie?
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("get", ({ path: { id } }) =>
          RecipeService.use((s) => s.get(id)).pipe(
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("create", ({ payload }) =>
          Effect.gen(function* () {
            const currentUser = yield* CurrentUser;
            const rs = yield* RecipeService;
            return yield* rs.create({ ...payload, author: currentUser.id });
          }).pipe(
            Effect.catchTag(
              "SqlError",
              "ParseError",
              "NoSuchElementException",
              Effect.die,
            ),
          ),
        )
        .handle("byAuthor", ({ path: { author } }) =>
          RecipeService.use((s) => s.byAuthor(author)).pipe(
            Effect.catchTag("SqlError", "ParseError", Effect.die),
          ),
        )
        .handle("mine", () =>
          Effect.gen(function* () {
            const currentUser = yield* CurrentUser;
            const rs = yield* RecipeService;
            return yield* rs.byAuthor(currentUser.id);
          }).pipe(Effect.catchTag("SqlError", "ParseError", Effect.die)),
        ),
    ),
).pipe(Layer.provide([RecipeService.Default]));
