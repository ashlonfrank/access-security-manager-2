import {
  paymentTypes,
  permissionsStorageKey,
  readStoredPermissions,
  seedPermissionsForUser,
  statementTypes,
  type PermissionUser,
  type Permissions,
} from "../../userPermissions";

/** Proposal 2 demo: Riverside (2) and Roastery (3) show different statement entitlements. */
export const P2_DEMO_STATEMENT_COMPANY_INDICES = [2, 3] as const;

function hashKey(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hashUserId(userId: string): number {
  return hashKey(userId);
}

/** Hard-coded demo statement mix per location (role still gates money movement, etc.). */
export function demoStatementEntitlements(
  companyIdx: number,
  userId: string,
): Partial<Record<string, boolean>> | null {
  if (companyIdx === 2) {
    const hash = hashKey(`${userId}:riverside`);
    return Object.fromEntries(
      statementTypes.map((name, index) => [
        name,
        ((hash >> index) & 1) === 1,
      ]),
    );
  }
  if (companyIdx === 3) {
    return {
      "See activity and balances": false,
      "See check images": true,
      "See statements and documents": false,
    };
  }
  return null;
}

export function permissionsWithCompanyStatements(
  base: Permissions,
  companyIdx: number,
  userId: string,
): Permissions {
  const demo = demoStatementEntitlements(companyIdx, userId);
  if (!demo) return base;
  const allowed = { ...base.allowed };
  for (const [name, flag] of Object.entries(demo)) {
    if (typeof flag === "boolean") allowed[name] = flag;
  }
  return { ...base, allowed };
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

/** Persist edits but keep Riverside/Roastery statement rows demo-driven on display. */
export function mergeSavedPermissionsFromEditor(
  stored: Permissions,
  edited: Permissions,
  companyIdx: number,
): Permissions {
  if (companyIdx !== 2 && companyIdx !== 3) return edited;
  const allowed = { ...edited.allowed };
  statementTypes.forEach((name) => {
    allowed[name] = stored.allowed[name];
  });
  return { ...edited, allowed };
}
