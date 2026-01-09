import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
  OpenApi,
} from "@effect/platform";
import { Schema } from "effect";
import { RecipeNotFound } from "./Error";
import { RecipeId, RecipeIdFromString, Recipes } from "./Table";
import { UserIdFromString } from "src/Users/Table";
import { Unauthorized } from "@effect/platform/HttpApiError";
import { Authorization } from "src/Auth/CurrentUser";

const RecipeSpec = Recipes.select.omit("author");

export class RecipesApi extends HttpApiGroup.make("recipes")
  .add(HttpApiEndpoint.get("list")`/`.addSuccess(Schema.Array(Recipes.select)))
  .add(
    HttpApiEndpoint.get(
      "get",
    )`/${HttpApiSchema.param("id", RecipeIdFromString)}`
      .addSuccess(Recipes.select)
      .addError(RecipeNotFound),
  )
  .add(
    HttpApiEndpoint.post("create")`/`
      .setPayload(RecipeSpec)
      .addSuccess(RecipeId)
      .middleware(Authorization),
  )
  .add(
    HttpApiEndpoint.get(
      "byAuthor",
    )`/author/${HttpApiSchema.param("author", UserIdFromString)}`
      .addSuccess(Schema.Array(Recipes.select)),
  )
  .add(
    HttpApiEndpoint.get("mine")`/mine`
      .addError(Unauthorized)
      .addSuccess(Schema.Array(Recipes.select))
      .middleware(Authorization),
  )
  .prefix("/recipes")
  .annotate(OpenApi.Title, "Recipes")
  .annotate(OpenApi.Description, "Recipes management API") {}
