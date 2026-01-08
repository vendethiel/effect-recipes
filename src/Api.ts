import { HttpApi, OpenApi } from "@effect/platform";
import { RecipesApi } from "./Recipes/Api";
import { UsersApi } from "./Users/Api";

export class Api extends HttpApi.make("api")
  .add(RecipesApi)
  .add(UsersApi)
  .annotate(OpenApi.Title, "Main API") {}
