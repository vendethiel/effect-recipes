import { HttpApiSchema } from "@effect/platform";
import { Model } from "@effect/sql";
import { Schema } from "effect/index";

export const RecipeId = Schema.Number.pipe(Schema.brand("RecipeId"));
export type RecipeId = typeof RecipeId.Type;
export const RecipeIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(RecipeId)
);

export class Recipe extends Model.Class<Recipe>("Recipe")({
  id: Model.Generated(RecipeId),
  title: Schema.String
})
{}

export class RecipeNotFound extends Schema.TaggedClass<RecipeNotFound>("RecipeNotFound")(
  "RecipeNotFound",
  { id: RecipeId },
  HttpApiSchema.annotations({ status: 404 }))
{}
