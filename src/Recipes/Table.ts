import { Schema } from "effect";
import { Generated, Table } from "effect-sql-kysely";

export const RecipeId = Schema.BigInt.pipe(Schema.brand("RecipeId"));
export type RecipeId = typeof RecipeId.Type;

export const Recipes = Table({
  id: Generated(RecipeId),
  title: Schema.String,
});
