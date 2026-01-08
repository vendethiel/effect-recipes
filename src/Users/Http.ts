import { HttpApiBuilder } from "@effect/platform";
import { Effect } from "effect";
import { Api } from "src/Api";
import { CurrentUser } from "src/Platform/CurrentUser";

export const HttpUsersLive = HttpApiBuilder.group(Api, "users", (handlers) =>
  Effect.succeed(handlers.handle("me", () => CurrentUser)),
);
