import { coffeeCompanies } from "../../business";
import { accountsForCompany, type DemoCompanyAccount } from "../../demoAccounts";

/** Proposal 2: all company accounts stay visible; defaults are independent of entitlements. */
export function allAccountsForP2Company(companyIdx: number): DemoCompanyAccount[] {
  return accountsForCompany(companyIdx);
}

function checkingAccounts(accounts: DemoCompanyAccount[]): DemoCompanyAccount[] {
  return accounts.filter((a) => a.product === "checking");
}

function firstOfProduct(
  accounts: DemoCompanyAccount[],
  product: DemoCompanyAccount["product"],
): DemoCompanyAccount | undefined {
  return accounts.find((a) => a.product === product);
}

export function seedP2AccountAccess(
  role: string,
  companyIdx: number,
): Record<string, boolean> {
  const accounts = accountsForCompany(companyIdx);
  const access = Object.fromEntries(accounts.map((a) => [a.id, false]));

  if (role === "Custom") return access;

  const setProduct = (product: DemoCompanyAccount["product"], on: boolean) => {
    accounts.filter((a) => a.product === product).forEach((a) => {
      access[a.id] = on;
    });
  };

  switch (role) {
    case "Admin":
    case "CFO":
      accounts.forEach((a) => {
        access[a.id] = true;
      });
      break;
    case "Business Partner":
      setProduct("checking", true);
      setProduct("savings", true);
      setProduct("credit_card", true);
      setProduct("merchant_services", true);
      break;
    case "Finance Lead":
      setProduct("checking", true);
      setProduct("savings", true);
      setProduct("payroll", true);
      break;
    case "Money Mover": {
      checkingAccounts(accounts)
        .slice(0, 2)
        .forEach((a) => {
          access[a.id] = true;
        });
      break;
    }
    case "Accountant":
      setProduct("checking", true);
      setProduct("savings", true);
      break;
    case "Read Only": {
      const firstChecking = firstOfProduct(accounts, "checking");
      const firstCredit = firstOfProduct(accounts, "credit_card");
      if (firstChecking) access[firstChecking.id] = true;
      if (firstCredit) access[firstCredit.id] = true;
      break;
    }
    default:
      break;
  }

  return access;
}

export function mergeP2AccountMaps(
  seeded: Record<string, boolean>,
  saved: Record<string, boolean> | undefined,
): Record<string, boolean> {
  if (!saved) return seeded;
  return Object.fromEntries(
    Object.keys(seeded).map((id) => [
      id,
      typeof saved[id] === "boolean" ? saved[id] : seeded[id],
    ]),
  );
}

export function seedP2AccountAccessAllCompanies(role: string): Record<string, boolean> {
  let access: Record<string, boolean> = {};
  for (let idx = 0; idx < coffeeCompanies.length; idx++) {
    access = { ...access, ...seedP2AccountAccess(role, idx) };
  }
  return access;
}
