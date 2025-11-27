import { Effect, Schema } from "effect";
import { RecipeId } from "src/Recipes/Model";

export const RecipeRow = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
});
export type RecipeRow = typeof RecipeRow.Type;

function deserializeRecipe(row: RecipeRow) {
  return {
    id: RecipeId.make(row.id),
    title: row.title,
  };
}

export const deserializeUnknownRecipe = (row: unknown) =>
  Schema.decodeUnknown(RecipeRow)(row).pipe(Effect.andThen(deserializeRecipe));
