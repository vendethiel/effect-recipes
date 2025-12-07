import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Schema } from "effect";
import { RecipeNotFound } from "./Error";
import { RecipeId, RecipeIdFromString, Recipes } from "./Table";

export class RecipesApi extends HttpApiGroup.make("recipes")
  .add(
    HttpApiEndpoint.get("list", "/").addSuccess(Schema.Array(Recipes.select)),
  )
  .add(
    HttpApiEndpoint.get("get", "/:id")
      .setPath(Schema.Struct({ id: RecipeIdFromString }))
      .addSuccess(Recipes.select)
      .addError(RecipeNotFound),
  )
  .add(
    HttpApiEndpoint.post("create", "/")
      .setPayload(Recipes.insert)
      .addSuccess(RecipeId),
  )
  .prefix("/recipes")
  .annotate(OpenApi.Title, "Recipes")
  .annotate(OpenApi.Description, "Recipes management API") {}
