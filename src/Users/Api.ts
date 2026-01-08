import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { Unauthorized } from "@effect/platform/HttpApiError";
import { Users } from "./Table";
import { Authorization } from "src/Platform/CurrentUser";

export class UsersApi extends HttpApiGroup.make("users")
  .add(
    HttpApiEndpoint.get("me")`me`
      .addError(Unauthorized)
      .addSuccess(Users.select)
      .middleware(Authorization),
  )
  .prefix("/users")
  .annotate(OpenApi.Title, "Users")
  .annotate(OpenApi.Description, "Users management API") {}
