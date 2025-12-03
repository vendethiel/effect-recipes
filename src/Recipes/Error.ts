import { HttpApiSchema } from "@effect/platform";
import { Schema } from "effect/index";
import { RecipeId } from "./Table";

export class RecipeNotFound extends Schema.TaggedError<RecipeNotFound>(
  "RecipeNotFound",
)(
  "RecipeNotFound",
  { id: RecipeId },
  HttpApiSchema.annotations({ status: 404 }),
) {}
