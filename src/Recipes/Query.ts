import { Schema } from "effect";
import { Db } from "../Db";
import { Recipes } from "./Table";

export const listRecipes = Db.schema.select({
  Request: Schema.Void,
  Result: Recipes.select,
  execute: (db) => db.selectFrom("recipes").selectAll(),
});

export const getRecipe = Db.schema.findOne({
  Request: Recipes.select.fields.id,
  Result: Recipes.select,
  execute: (db, id) =>
    db.selectFrom("recipes").where("id", "=", id).selectAll(),
});

export const createRecipe = Db.schema.single({
  Request: Recipes.insert,
  Result: Recipes.select,
  execute: (db, spec) => db.insertInto("recipes").values(spec).returningAll(),
});
