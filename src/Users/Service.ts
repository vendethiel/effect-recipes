import { Effect } from "effect";
import { UserRepository } from "./Repository";
import { UserId } from "./Table";
import { UserNotFound } from "./Error";

export class UserService extends Effect.Service<UserService>()("UserService", {
  dependencies: [],
  accessors: true,
  effect: Effect.gen(function* () {
    const db = yield* UserRepository;

    return {
      get: Effect.fn("UserService.get")(function* (id: UserId) {
        const row = yield* db.get(id);
        return yield* row.pipe(
          Effect.catchTag("NoSuchElementException", () =>
            UserNotFound.make({ id }),
          ),
        );
      }),
    };
  }),
}) {}
