import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface RecipeTable {
  id: Generated<number>;
  title: string;
}

export type RecipeRow = Selectable<RecipeTable>;
export type RecipeNew = Insertable<RecipeTable>;
export type RecipeUpdate = Updateable<RecipeTable>;
