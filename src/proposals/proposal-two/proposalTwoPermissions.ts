import type { PermissionUser, Permissions } from "../../userPermissions";
import {
  mergeP2AccountMaps,
  seedP2AccountAccessAllCompanies,
} from "./proposalTwoAccounts";
import {
  P2_ACCOUNT_INFORMATION,
  P2_PERMISSIONS_STORAGE_KEY,
  normalizeP2Role,
  parseStoredP2Permissions,
  permissionsForP2Role,
  type StoredP2Permissions,
} from "./proposalTwoPermissionModel";

/** Proposal 2 demo: Riverside (2) and Roastery (3) swap Account Information only. */
export const P2_DEMO_STATEMENT_COMPANY_INDICES = [2, 3] as const;

function hashKey(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function demoAccountInformationForCompany(
  companyIdx: number,
  userId: string,
): Partial<Record<string, boolean>> | null {
  if (companyIdx === 2) {
    const hash = hashKey(`${userId}:riverside`);
    return Object.fromEntries(
      P2_ACCOUNT_INFORMATION.map((name, index) => [
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
      "Download statements and documents": true,
    };
  }
  return null;
}

export function permissionsWithCompanyStatements(
  base: Permissions,
  companyIdx: number,
  userId: string,
): Permissions {
  const demo = demoAccountInformationForCompany(companyIdx, userId);
  if (!demo) return base;
  const allowed = { ...base.allowed };
  for (const [name, flag] of Object.entries(demo)) {
    if (typeof flag === "boolean") allowed[name] = flag;
  }
  return { ...base, allowed };
}

export function seedPermissionsForP2(
  user: PermissionUser,
  roleOverride?: string,
): StoredP2Permissions {
  const role = normalizeP2Role(roleOverride ?? user.role);
  const base = permissionsForP2Role(role);
  const seededAccounts = seedP2AccountAccessAllCompanies(role);
  return {
    ...base,
    accounts: seededAccounts,
    p2Role: role,
  };
}

export function readProposalTwoPermissions(user: PermissionUser): StoredP2Permissions {
  try {
    const raw = JSON.parse(
      localStorage.getItem(P2_PERMISSIONS_STORAGE_KEY(user.id)) || "null",
    );
    const saved = parseStoredP2Permissions(raw);
    if (saved) {
      const role = normalizeP2Role(saved.p2Role ?? user.role);
      const seededAccounts = seedP2AccountAccessAllCompanies(role);
      return {
        ...saved,
        p2Role: role,
        accounts: mergeP2AccountMaps(seededAccounts, saved.accounts),
      };
    }
  } catch {
    /* fall through */
  }
  return seedPermissionsForP2(user);
}

/** Persist edits but keep Riverside/Roastery Account Information demo-driven on display. */
export function mergeSavedPermissionsFromEditor(
  stored: Permissions,
  edited: Permissions,
  companyIdx: number,
): Permissions {
  if (companyIdx !== 2 && companyIdx !== 3) return edited;
  const allowed = { ...edited.allowed };
  P2_ACCOUNT_INFORMATION.forEach((name) => {
    allowed[name] = stored.allowed[name] ?? false;
  });
  return { ...edited, allowed };
}

export function saveProposalTwoPermissions(
  userId: string,
  value: StoredP2Permissions,
): void {
  localStorage.setItem(P2_PERMISSIONS_STORAGE_KEY(userId), JSON.stringify(value));
}
