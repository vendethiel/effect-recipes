import {
  HttpApiMiddleware,
  HttpApiSchema,
  HttpApiSecurity,
  OpenApi,
} from "@effect/platform";
import { Context, Effect, Layer, Redacted, Schema } from "effect";
import { UserRepository } from "src/Users/Repository";
import type { User } from "src/Users/Table";

export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {},
  HttpApiSchema.annotations({ status: 401 }),
) {}

export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  User
>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  "Authorization",
  {
    failure: Unauthorized,
    provides: CurrentUser,
    security: {
      userToken: HttpApiSecurity.apiKey({
        key: "X-Authorization",
        in: "header",
      }).pipe(
        HttpApiSecurity.annotate(
          OpenApi.Description,
          "X-Authorization header token login",
        ),
      ),
    },
  },
) {}

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const userRepo = yield* UserRepository;
    return {
      userToken: (bearerToken) =>
        Effect.gen(function* () {
          const user = yield* userRepo.getByToken(Redacted.value(bearerToken));
          return yield* user.pipe(
            Effect.catchTag("NoSuchElementException", () => new Unauthorized()),
          );
        }).pipe(Effect.catchTag("SqlError", "ParseError", Effect.die)),
    };
  }),
);
