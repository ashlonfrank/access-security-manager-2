import type { User } from "../../App";
import initialUsers from "../../users.json";
import {
  coffeeCompanies,
  companyIndex,
  normalizeRole,
} from "../../business";
import {
  accountLastFour,
  accountsForCompany,
  type AccountProduct,
} from "../../demoAccounts";

const shortAccountNames: Record<AccountProduct, string> = {
  checking: "Commercial Checking",
  savings: "Money Market account",
  credit_card: "Business credit",
  payroll: "Payroll",
  merchant_services: "Merchant services",
};

export type ProposalTwoUser = User & {
  userId: string;
  mobileAccess: boolean;
  thirdPartyAccess: boolean;
};

function toProposalUser(user: User): ProposalTwoUser {
  return {
    ...user,
    role: normalizeRole(user.role),
    userId: `SU${user.id.slice(-4)}`,
    mobileAccess: user.status === "Active" || user.status === "Invited",
    thirdPartyAccess: user.role !== "Read Only",
  };
}

const roster = initialUsers.map((user) => toProposalUser(user as User));

export const proposalTwoUsers: ProposalTwoUser[] = roster.filter(
  (user) => user.status === "Active",
);

export type CompanyGroup = {
  id: string;
  name: string;
  cardTitle: string;
  accountCount: number;
  users: {
    userId: string;
    role: string;
    accountLabel: string;
  }[];
};

export type AccountGroup = {
  id: string;
  label: string;
  users: { userId: string; role: string }[];
};

function usersInCompany(index: number): ProposalTwoUser[] {
  return proposalTwoUsers.filter((user) => companyIndex(user.id) === index);
}

export const companyGroups: CompanyGroup[] = coffeeCompanies.map(
  (company, index) => {
    const members = usersInCompany(index);
    const accounts = accountsForCompany(index);
    return {
      id: String(index),
      name: `${company.name} · ${company.location}`,
      cardTitle: company.location,
      accountCount: accounts.length,
      users: members.map((user, memberIndex) => {
        const account = accounts[memberIndex % accounts.length];
        return {
          userId: user.id,
          role: user.role,
          accountLabel: `${shortAccountNames[account.product]} (...${accountLastFour(user.id, account.id)})`,
        };
      }),
    };
  },
);

export const accountGroups: AccountGroup[] = coffeeCompanies.map(
  (company, index) => ({
    id: `company-${index}`,
    label: `${company.location} operating account (...${7890 + index})`,
    users: usersInCompany(index).slice(0, 4).map((user) => ({
      userId: user.id,
      role: user.role,
    })),
  }),
);

/** Account labels aligned with baseline / Proposal 1 company demo data. */
export const permissionsAccounts = accountGroups.map((group) => group.label);

export function userById(id: string): ProposalTwoUser | undefined {
  return roster.find((user) => user.id === id);
}

export const defaultPermissionsUserId = proposalTwoUsers[0]?.id ?? "69029";
