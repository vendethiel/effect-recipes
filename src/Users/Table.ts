import { Schema } from "effect";
import { Generated, Table } from "effect-sql-kysely";

export const UserId = Schema.Number.pipe(Schema.brand("UserId"));
export type UserId = typeof UserId.Type;

export const Users = Table({
  id: Generated(UserId),
  email: Schema.String,
  token: Schema.String,
});

export type User = typeof Users.select.Type;
export const SafeUser = Users.select.pipe(Schema.omit("token"));
