import { HttpApiSchema } from "@effect/platform";
import { Schema } from "effect";
import { UserId } from "./Table";

export class UserNotFound extends Schema.TaggedError<UserNotFound>(
  "UserNotFound"
)(
  "UserNotFound",
  { id: UserId },
  HttpApiSchema.annotations({ status: 404 })
) {}
