import type { Generated, Insertable, Selectable, Updateable } from "kysely";
import { RecipeId } from "./Model";

export interface RecipeTable {
  id: Generated<number>;
  title: string;
}

export type RecipeRow = Selectable<RecipeTable>;
export type RecipeNew = Insertable<RecipeTable>;
export type RecipeUpdate = Updateable<RecipeTable>;

export function deserializeRecipe(row: RecipeRow) {
  return {
    id: RecipeId.make(row.id),
    title: row.title,
  };
}
