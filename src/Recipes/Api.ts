import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Recipe, RecipeIdFromString, RecipeNotFound } from "../Model"
import { Schema } from "effect";

export class RecipesApi extends HttpApiGroup.make("recipes")
  .add(
    HttpApiEndpoint.get("list", "/")
      .addSuccess(Schema.Array(Recipe.json))
  )
  .add(
    HttpApiEndpoint.get("get", "/:id")
      .setPath(Schema.Struct({ id: RecipeIdFromString }))
      .addSuccess(Recipe.json)
      .addError(RecipeNotFound)
  )
  .prefix("/recipes")
  .annotate(OpenApi.Title, "Recipes")
  .annotate(OpenApi.Description, "Recipes management API")
{}
