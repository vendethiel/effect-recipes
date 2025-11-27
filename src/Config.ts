/*
type ConfigValues = {
  port: number;
  db: Redacted<string>;
};

export class Config extends Effect.Service<Config>()("app/Config", {
  effect: Effect.gen(function* () {
    const port = yield* EConfig.number("PORT").pipe(EConfig.withDefault(3030));
    const db = yield* EConfig.redacted("DB");
    return { port, db } satisfies ConfigValues;
  }),
}) {}
*/

/*
export const FooLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const enable = yield* Config.boolean("ENABLE").pipe(
      Config.withDefault(false),
    );
    if (enable) {
      return ...().pipe(
        Layer.provide(NodeSocket.layerWebSocketConstructor),
      );
    }
    return Layer.empty;
  }),
);
*/
