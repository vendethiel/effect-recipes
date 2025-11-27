import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";
import { Api } from "src/Api";
import { RecipeNotFound } from "src/Model";

export const HttpRecipesLive = HttpApiBuilder.group(
  Api,
  "recipes",
  (handlers) =>
    // eslint-disable-next-line require-yield
    Effect.gen(function* () {
      return handlers
        .handle("list", () => Effect.succeed([]))
        .handle(
          "get",
          ({ path }) => Effect.fail(new RecipeNotFound({ id: path.id })), // TODO
        );
    }),
);
