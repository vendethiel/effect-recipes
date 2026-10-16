import { Schema } from "effect";
import { Generated, Table } from "effect-sql-kysely";

export const UserId = Schema.Number.pipe(Schema.brand("UserId"));
export type UserId = typeof UserId.Type;
export const UserIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(UserId),
);

export const Users = Table({
  id: Generated(UserId),
  email: Schema.String,
  token: Schema.String,
});

export const User = Users.select;
export type User = typeof User.Type;
export const SafeUser = Users.select.pipe(Schema.omit("token"));
