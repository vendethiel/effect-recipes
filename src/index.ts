import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpLive } from "./Http";
import { PgDbLive } from "./Db";

HttpLive.pipe(
  Layer.provide(PgDbLive),
  Layer.launch,
  NodeRuntime.runMain,
);
