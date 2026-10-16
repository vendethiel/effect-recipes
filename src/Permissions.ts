import { Schema } from "effect";
import { User } from "./Users/Table";

const PermissionObject = Schema.Literal("recipe", "user");
type PermissionObject = typeof PermissionObject.Type;
const Permissions = {
  recipe: ["read", "create", "update", "delete"],
  user: ["read", "create", "update", "delete", "auth", "logout"]
} as const satisfies Record<PermissionObject, string[]>;
type Permissions = typeof Permissions;
//type Permission = Permissions[PermissionObject][number];

type FlatPermission = {
  [K in keyof Permissions]: `${K}:${Permissions[K][number]}`
}[keyof Permissions];
const FlatPermissions: Array<FlatPermission> = Object.entries(Permissions).flatMap(([o, rs]) =>
  rs.map(r => `${o}:${r}` as FlatPermission)
);

export const Permission = Schema.Literal(...FlatPermissions).annotations({
  identifier: "Permission"
});
export type Permission = typeof Permission.Type;

export function permissionsForUser(_user: User | undefined): Set<Permission> {
  return new Set();
}
