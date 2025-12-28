import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpLive } from "./Http";
import { PgDbLive } from "./Db";
import { AuthorizationLive } from "./Platform/CurrentUser";
import { RecipeRepository } from "./Recipes/Repository";
import { UserRepository } from "./Users/Repository";

HttpLive.pipe(
  Layer.provide(AuthorizationLive),
  Layer.provide(RecipeRepository.Default),
  Layer.provide(UserRepository.Default),
  Layer.provide(PgDbLive),
  Layer.launch,
  NodeRuntime.runMain,
);
