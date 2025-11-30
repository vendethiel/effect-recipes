import { HttpApiSchema } from "@effect/platform";
import { Model } from "@effect/sql";
import { Schema } from "effect/index";

export const RecipeId = Schema.BigInt.pipe(Schema.brand("RecipeId"));
export type RecipeId = typeof RecipeId.Type;

export class Recipe extends Model.Class<Recipe>("Recipe")({
  id: Model.Generated(RecipeId),
  title: Schema.String,
}) { }

export class RecipeNotFound extends Schema.TaggedError<RecipeNotFound>(
  "RecipeNotFound",
)(
  "RecipeNotFound",
  { id: RecipeId },
  HttpApiSchema.annotations({ status: 404 }),
) { }

export class RecipeCreationError extends Schema.TaggedError<RecipeCreationError>(
  "RecipeCreationError"
)(
  "RecipeCreationError",
  {},
  HttpApiSchema.annotations({ status: 422 })
) { }
