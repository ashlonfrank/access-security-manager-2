import {
  paymentTypes,
  permissionsStorageKey,
  readStoredPermissions,
  seedPermissionsForUser,
  type PermissionUser,
  type Permissions,
} from "../../userPermissions";

function hashUserId(userId: string): number {
  let hash = 2166136261;
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Stable demo spread so each user’s rights look different on first load (not API-driven). */
function varyPermissionsSeed(base: Permissions, userId: string): Permissions {
  const hash = hashUserId(userId);
  const limits = { ...base.limits };
  paymentTypes.forEach((name, index) => {
    if (!base.allowed[name]) return;
    const nibble = (hash >> (index % 12)) & 0xf;
    const factor = 0.55 + nibble / 20;
    limits[name] = (Number(base.limits[name]) * factor).toFixed(2);
  });

  const accountIds = Object.keys(base.accounts);
  const accounts = { ...base.accounts };
  accountIds.forEach((id, index) => {
    if (((hash >> index) & 7) === 0) {
      accounts[id] = !accounts[id];
    }
  });

  const mfa = (hash & 0b1111) !== 0;
  const token: Permissions["token"] = mfa
    ? (hash & 1) === 0
      ? "Soft token"
      : "Hard token"
    : "No token";

  return { ...base, limits, accounts, mfa, token };
}

export function readProposalTwoPermissions(user: PermissionUser): Permissions {
  try {
    if (localStorage.getItem(permissionsStorageKey(user.id))) {
      return readStoredPermissions(user);
    }
  } catch {
    /* use seeded demo */
  }
  return varyPermissionsSeed(seedPermissionsForUser(user), user.id);
}
