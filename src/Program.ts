import { Layer } from "effect";
import { HttpLive } from "./Http";
import { NodeRuntime } from "@effect/platform-node";

HttpLive.pipe(
  // Layer.provide() // TODO tracing/logging
  Layer.launch,
  NodeRuntime.runMain
);
