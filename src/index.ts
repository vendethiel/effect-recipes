import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpLive } from "./Http";
import { PgDbLive } from "./Db";
import { AuthorizationLive } from "./Platform/CurrentUser";
import { RecipeRepository } from "./Recipes/Repository";
import { UserRepository } from "./Users/Repository";

/* eslint-disable-next-line functional/no-expression-statements */
HttpLive.pipe(
  Layer.provide(AuthorizationLive),
  Layer.provide(RecipeRepository.Default),
  Layer.provide(UserRepository.Default),
  Layer.provide(PgDbLive),
  Layer.launch,
  NodeRuntime.runMain,
);
