import { HttpApi, OpenApi } from "@effect/platform";
import { RecipesApi } from "./Recipes/Api";

export class Api extends HttpApi.make("api")
  .add(RecipesApi)
  .annotate(OpenApi.Title, "Main API") {}
