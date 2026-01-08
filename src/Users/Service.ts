import { Effect } from "effect";

export class UserService extends Effect.Service<UserService>()(
  "UserService",
  {
    dependencies: [],
    accessors: true,
    effect: Effect.gen(function*(){
      // const _db = yield* UserRepository;

      return {
        
      }
    })
  }
) {}
