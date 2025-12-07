import { Schema } from "effect";
import { Generated, Table } from "effect-sql-kysely";

export const RecipeId = Schema.Number.pipe(Schema.brand("RecipeId"));
export type RecipeId = typeof RecipeId.Type;
export const RecipeIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(RecipeId),
);

export const Recipes = Table({
  id: Generated(RecipeId),
  title: Schema.String,
});

export type Recipe = (typeof Recipes)["select"]["Type"];
export type RecipeSpec = (typeof Recipes)["insert"]["Type"];
