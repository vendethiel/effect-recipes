import { Effect, Schema, Option } from "effect";
import { Branded } from "effect/Brand";
import { User } from "./Users/Table";
import { CurrentUser, Unauthorized } from "./Auth/CurrentUser";

const PermissionObject = Schema.Literal("recipe", "user");
type PermissionObject = typeof PermissionObject.Type;
const Permissions = {
  recipe: ["read", "create", "update", "delete"],
  user: ["read", "create", "update", "delete", "auth", "logout"]
} as const satisfies Record<PermissionObject, string[]>;
type Permissions = typeof Permissions;
//type Permission = Permissions[PermissionObject][number];

export type Permission = {
  [K in keyof Permissions]: `${K}:${Permissions[K][number]}`
}[keyof Permissions];
export type UserPermission = Permission | `${Permission}:own`
const FlatPermissions: Array<Permission> = Object.entries(Permissions).flatMap(([o, rs]) =>
  rs.map(r => `${o}:${r}` as Permission)
);

export const Permission = Schema.Literal(...FlatPermissions).annotations({
  identifier: "Permission"
});
export const UserPermission = Schema.Literal(
  ...FlatPermissions,
  ...FlatPermissions.map((p) => `${p}:own` satisfies UserPermission)
).annotations({
  identifier: "UserPermission"
});

export function permissionsForUser(_user: User | undefined): Set<Permission> {
  return new Set();
}

type OwnObjectPredicate<T> = undefined | ((obj: T, u: User) => boolean);
type Authorized<T, P extends Permission> = Effect.Effect<Branded<T, `authorized:${P}`>, Unauthorized>;
export function authorizateFor<T, P extends Permission>(pred: OwnObjectPredicate<T>, perm: P) {
  return (user: User | undefined, permissions: Set<UserPermission>, obj: T): boolean => {
    return permissions.has(perm) || (user != undefined && pred != undefined && permissions.has(`${perm}:own`) && pred(obj, user));
  }
}

export function authorize<T, P extends Permission>(pred: OwnObjectPredicate<T>, perm: P) {
  const auth = authorizateFor(pred, perm);
  return function* (obj: T) {
    const userOpt = yield* Effect.serviceOption(CurrentUser);
    const permissions = Option.getOrUndefined(userOpt)?.permissions ?? new Set();
    if (auth(Option.getOrUndefined(userOpt), permissions, obj))
      return Effect.succeed(obj as Authorized<T, P>);
    return Effect.fail(new Unauthorized());
  };
}


