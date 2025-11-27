import { NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { HttpLive } from "./Http";

HttpLive.pipe(
  // Layer.provide() // TODO tracing/logging
  Layer.launch,
  NodeRuntime.runMain,
);
