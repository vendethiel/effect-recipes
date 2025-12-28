import { Effect } from "effect";
import { makeSchema } from "effect-sql-kysely";
import { Db } from "src/Db";
import { Users } from "./Table";

export class UserRepository extends Effect.Service<UserRepository>()(
  "UserRepository",
  {
    dependencies: [],
    effect: Effect.gen(function* () {
      const { kysely } = yield* Db;
      const { findOne } = makeSchema(kysely);

      return {
        get: Effect.fn("UserRepository.get")(
          findOne({
            Request: Users.select.fields.id,
            Result: Users.select,
            execute: (db, id) =>
              db.selectFrom("users").where("id", "=", id).selectAll(),
          }),
        ),
        getByToken: Effect.fn("UserRepository.getByToken")(
          findOne({
            Request: Users.select.fields.token,
            Result: Users.select,
            execute: (db, token) =>
            db.selectFrom("users").where("token", "=", token).selectAll()
          })
        )
      };
    }),
  },
) {}
