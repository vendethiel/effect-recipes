import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import { type Recipe, RecipeId } from "./Model";

export interface RecipeTable {
  id: Generated<bigint>;
  title: string;
}

export type RecipeRow = Selectable<RecipeTable>;
export type RecipeNew = Insertable<RecipeTable>;
export type RecipeUpdate = Updateable<RecipeTable>;

export function deserializeRecipe(row: RecipeRow): Recipe {
  return {
    id: RecipeId.make(row.id),
    title: row.title,
  };
}
