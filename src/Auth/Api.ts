import { HttpApiGroup, OpenApi } from "@effect/platform";

export class AuthApi extends HttpApiGroup.make("auth")
  .prefix("/auth")
  .annotate(OpenApi.Title, "Auth")
  .annotate(OpenApi.Description, "Auth API")
{}
