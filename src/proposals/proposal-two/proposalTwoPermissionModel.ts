import type { Permissions } from "../../userPermissions";

/** Proposal 2 — eight roles; Admin and CFO share defaults but are distinct options. */
export const P2_SELECTABLE_ROLES = [
  "Admin",
  "CFO",
  "Business Partner",
  "Finance Lead",
  "Money Mover",
  "Accountant",
  "Read Only",
  "Custom",
] as const;

export type P2SelectableRole = (typeof P2_SELECTABLE_ROLES)[number];

export const P2_ROLE_DESCRIPTIONS: Record<P2SelectableRole, string> = {
  Admin:
    "Full access to manage business accounts, payments, and users.",
  CFO: "Full access to financial accounts, payments, and reporting.",
  "Business Partner":
    "Can access business accounts, cards, and payment processing services.",
  "Finance Lead":
    "Can manage day-to-day finances, payments, and payroll.",
  "Money Mover":
    "Can make payments and transfers from authorized accounts.",
  Accountant:
    "Can view financial information, deposit checks, and manage cash flow.",
  "Read Only":
    "Can view accounts and transactions and can be issued cards.",
  Custom:
    "Choose specific permissions and account access based on the employee’s responsibilities.",
};

export const P2_ACCOUNT_INFORMATION = [
  "See activity and balances",
  "See check images",
  "See statements and documents",
  "Download statements and documents",
] as const;

export const P2_MONEY_LIMIT_TYPES = [
  "Chase QuickDeposit",
  "ACH payments",
  "ACH vendor payments",
  "Bill pay",
  "CashFlow 360",
  "Transfers and payments",
  "Wires",
  "Zelle",
  "Payroll",
] as const;

export const P2_CREDIT_CARDS = ["Card access", "Business credit access"] as const;

export const P2_MERCHANT_SERVICES = [
  "Chase QuickAccept",
  "Mobile Checkout",
  "Payment Solutions",
] as const;

export function allP2EntitlementKeys(): string[] {
  return [
    ...P2_ACCOUNT_INFORMATION,
    ...P2_MONEY_LIMIT_TYPES,
    ...P2_CREDIT_CARDS,
    ...P2_MERCHANT_SERVICES,
  ];
}

const PREDEFINED_ROLES = new Set<string>([
  "Admin",
  "CFO",
  "Business Partner",
  "Finance Lead",
  "Money Mover",
  "Accountant",
  "Read Only",
]);

const MONEY_ENABLED_BY_ROLE: Record<string, readonly string[]> = {
  "Chase QuickDeposit": [
    "Admin",
    "CFO",
    "Finance Lead",
    "Money Mover",
    "Accountant",
  ],
  "ACH payments": ["Admin", "CFO", "Finance Lead", "Money Mover"],
  "ACH vendor payments": ["Admin", "CFO", "Finance Lead", "Money Mover"],
  "Bill pay": ["Admin", "CFO", "Finance Lead", "Money Mover"],
  "CashFlow 360": [
    "Admin",
    "CFO",
    "Finance Lead",
    "Money Mover",
    "Accountant",
  ],
  "Transfers and payments": ["Admin", "CFO", "Money Mover"],
  Wires: ["Admin", "CFO", "Money Mover"],
  Zelle: ["Admin", "CFO", "Money Mover"],
  Payroll: ["Admin", "CFO", "Finance Lead", "Money Mover"],
};

const MERCHANT_ENABLED = ["Admin", "CFO", "Business Partner"] as const;
const CARD_ACCESS_ROLES = ["Admin", "CFO", "Business Partner", "Read Only"] as const;
const BUSINESS_CREDIT_ROLES = ["Admin", "CFO", "Business Partner"] as const;

function moneyEnabled(role: string, name: string): boolean {
  if (role === "Custom") return false;
  return MONEY_ENABLED_BY_ROLE[name]?.includes(role) ?? false;
}

export function permissionsForP2Role(
  role: string,
): Omit<Permissions, "accounts"> {
  const allowed: Record<string, boolean> = {};
  for (const key of allP2EntitlementKeys()) {
    allowed[key] = false;
  }

  if (role !== "Custom") {
    for (const name of P2_ACCOUNT_INFORMATION) {
      allowed[name] = true;
    }
  }

  for (const name of P2_MONEY_LIMIT_TYPES) {
    allowed[name] = moneyEnabled(role, name);
  }

  for (const name of P2_CREDIT_CARDS) {
    if (name === "Card access") {
      allowed[name] = CARD_ACCESS_ROLES.includes(role as (typeof CARD_ACCESS_ROLES)[number]);
    } else {
      allowed[name] = BUSINESS_CREDIT_ROLES.includes(
        role as (typeof BUSINESS_CREDIT_ROLES)[number],
      );
    }
  }

  for (const name of P2_MERCHANT_SERVICES) {
    allowed[name] = MERCHANT_ENABLED.includes(
      role as (typeof MERCHANT_ENABLED)[number],
    );
  }

  const limits = Object.fromEntries(
    P2_MONEY_LIMIT_TYPES.map((name) => [name, "50000.00"]),
  );

  return {
    allowed,
    limits,
    mfa: role === "Custom" ? false : true,
    token: role === "Custom" ? ("No token" as const) : ("Soft token" as const),
  };
}

export function isP2PredefinedRole(role: string): boolean {
  return PREDEFINED_ROLES.has(role);
}

export function normalizeP2Role(role: string): P2SelectableRole {
  if (P2_SELECTABLE_ROLES.includes(role as P2SelectableRole)) {
    return role as P2SelectableRole;
  }
  if (role === "Custom") return "Custom";
  return "Read Only";
}

export const P2_PERMISSIONS_STORAGE_KEY = (userId: string) =>
  `asm-permissions-p2-v2-${userId}`;

export type StoredP2Permissions = Permissions & { p2Role?: string };

export function parseStoredP2Permissions(raw: unknown): StoredP2Permissions | null {
  if (!raw || typeof raw !== "object") return null;
  const blob = raw as StoredP2Permissions;
  if (typeof blob.mfa !== "boolean") return null;
  if (!["Soft token", "Hard token", "No token"].includes(blob.token)) return null;
  if (!blob.allowed || typeof blob.allowed !== "object") return null;
  if (!blob.limits || typeof blob.limits !== "object") return null;
  for (const name of P2_MONEY_LIMIT_TYPES) {
    if (typeof blob.limits[name] !== "string") return null;
  }
  for (const key of allP2EntitlementKeys()) {
    if (typeof blob.allowed[key] !== "boolean") return null;
  }
  if (
    blob.accounts !== null &&
    typeof blob.accounts === "object" &&
    !Array.isArray(blob.accounts)
  ) {
    return blob;
  }
  return null;
}

/** When a money permission is turned on, ensure limit default unless already set. */
export function applyP2MoneyToggleDefaults(
  previous: Permissions,
  permission: string,
  enabled: boolean,
): Permissions {
  if (!P2_MONEY_LIMIT_TYPES.includes(permission as (typeof P2_MONEY_LIMIT_TYPES)[number])) {
    return {
      ...previous,
      allowed: { ...previous.allowed, [permission]: enabled },
    };
  }
  const limits = { ...previous.limits };
  if (enabled && (!limits[permission] || Number(limits[permission]) <= 0)) {
    limits[permission] = "50000.00";
  }
  return {
    ...previous,
    allowed: { ...previous.allowed, [permission]: enabled },
    limits,
  };
}

export function stripP2ApprovalKeys(
  allowed: Record<string, boolean>,
): Record<string, boolean> {
  return Object.fromEntries(
    Object.entries(allowed).filter(
      ([key]) => !key.startsWith("Requires approval:"),
    ),
  );
}
