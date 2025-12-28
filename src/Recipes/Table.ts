import { Schema } from "effect";
import { Generated, Table } from "effect-sql-kysely";
import { UserId } from "src/Users/Table";

export const RecipeId = Schema.Number.pipe(Schema.brand("RecipeId"));
export type RecipeId = typeof RecipeId.Type;
export const RecipeIdFromString = Schema.NumberFromString.pipe(
  Schema.compose(RecipeId),
);

export const Recipes = Table({
  id: Generated(RecipeId),
  title: Schema.String,
  content: Schema.String,
  author: UserId,
});

// XXX use Kysely helpers
export type Recipe = typeof Recipes.select.Type;
export type RecipeCreate = typeof Recipes.insert.Type;
export type RecipeSpec = Exclude<RecipeCreate, "author">;
