export type ProposalTwoUser = {
  id: string;
  name: string;
  role: "Proxy admin" | "Authorized user";
  phone: string;
  email: string;
  status: "Active";
  userId: string;
  mobileAccess: boolean;
  thirdPartyAccess: boolean;
  dualControl?: boolean;
};

export type CompanyGroup = {
  id: string;
  name: string;
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

export const proposalTwoUsers: ProposalTwoUser[] = [
  {
    id: "cameron",
    name: "Cameron J. Morris",
    role: "Proxy admin",
    phone: "610-505-1234",
    email: "cj.morris@gmail.com",
    status: "Active",
    userId: "SU1234",
    mobileAccess: true,
    thirdPartyAccess: true,
  },
  {
    id: "james",
    name: "James Y Lynch",
    role: "Authorized user",
    phone: "610-505-1234",
    email: "cj.morris@gmail.com",
    status: "Active",
    userId: "SU1288",
    mobileAccess: true,
    thirdPartyAccess: true,
    dualControl: true,
  },
  {
    id: "rebecca",
    name: "Rebecca Lloyd",
    role: "Authorized user",
    phone: "610-505-1234",
    email: "cj.morris@gmail.com",
    status: "Active",
    userId: "SU1290",
    mobileAccess: true,
    thirdPartyAccess: false,
  },
  {
    id: "christopher",
    name: "Christopher Kang",
    role: "Authorized user",
    phone: "610-505-5678",
    email: "ckang@example.com",
    status: "Active",
    userId: "SU1301",
    mobileAccess: true,
    thirdPartyAccess: true,
  },
  {
    id: "peter",
    name: "Peter Parker",
    role: "Authorized user",
    phone: "212-555-0101",
    email: "pparker@example.com",
    status: "Active",
    userId: "SU1302",
    mobileAccess: false,
    thirdPartyAccess: true,
  },
  {
    id: "elizabeth",
    name: "Elizabeth Patel",
    role: "Authorized user",
    phone: "312-555-0199",
    email: "epatel@example.com",
    status: "Active",
    userId: "SU1303",
    mobileAccess: true,
    thirdPartyAccess: true,
  },
  {
    id: "jeffrey",
    name: "Jeffrey Joseph",
    role: "Authorized user",
    phone: "415-555-0122",
    email: "jjoseph@example.com",
    status: "Active",
    userId: "SU1304",
    mobileAccess: true,
    thirdPartyAccess: false,
  },
];

export const companyGroups: CompanyGroup[] = [
  {
    id: "yale",
    name: "Yale",
    accountCount: 8,
    users: [
      {
        userId: "cameron",
        role: "Proxy admin",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "christopher",
        role: "Authorized user",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "peter",
        role: "Authorized user",
        accountLabel: "Money Market account (...3883)",
      },
      {
        userId: "elizabeth",
        role: "Authorized user",
        accountLabel: "Business credit card (...6635)",
      },
    ],
  },
  {
    id: "met-trust",
    name: "Met Trust",
    accountCount: 6,
    users: [
      {
        userId: "christopher",
        role: "Authorized user",
        accountLabel: "Commercial Checking (...7841)",
      },
      {
        userId: "jeffrey",
        role: "Authorized user",
        accountLabel: "Commercial Checking (...7320)",
      },
    ],
  },
  {
    id: "mail",
    name: "Mail management",
    accountCount: 3,
    users: [
      {
        userId: "cameron",
        role: "Proxy admin",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "christopher",
        role: "Authorized user",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "peter",
        role: "Authorized user",
        accountLabel: "Money Market account (...3883)",
      },
      {
        userId: "elizabeth",
        role: "Authorized user",
        accountLabel: "Business credit card (...6635)",
      },
    ],
  },
  {
    id: "dane",
    name: "Dane Paul",
    accountCount: 12,
    users: [
      {
        userId: "cameron",
        role: "Proxy admin",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "christopher",
        role: "Authorized user",
        accountLabel: "Commercial Checking (...7890)",
      },
      {
        userId: "peter",
        role: "Authorized user",
        accountLabel: "Money Market account (...3883)",
      },
      {
        userId: "elizabeth",
        role: "Authorized user",
        accountLabel: "Business credit card (...6635)",
      },
    ],
  },
];

export const accountGroups: AccountGroup[] = [
  {
    id: "chk-7890",
    label: "Commercial Checking (...7890)",
    users: [
      { userId: "cameron", role: "Proxy admin" },
      { userId: "christopher", role: "Authorized user" },
      { userId: "james", role: "Authorized user" },
    ],
  },
  {
    id: "chk-6543",
    label: "Commercial Checking (...6543)",
    users: [
      { userId: "rebecca", role: "Authorized user" },
      { userId: "elizabeth", role: "Authorized user" },
    ],
  },
  {
    id: "loan-1105",
    label: "Term loan commitment (...1105)",
    users: [{ userId: "jeffrey", role: "Authorized user" }],
  },
  {
    id: "sav-5678",
    label: "Commercial savings (...5678)",
    users: [
      { userId: "peter", role: "Authorized user" },
      { userId: "cameron", role: "Proxy admin" },
    ],
  },
];

export const cameronRightsAccounts = [
  "COMMERCIAL CHECKING (...7890)",
  "COMMERCIAL CHECKING (...6543)",
  "TERM LOAN COMMITMENT (...1105)",
  "COMMERCIAL SAVINGS (...5678)",
];

export function userById(id: string): ProposalTwoUser | undefined {
  return proposalTwoUsers.find((u) => u.id === id);
}
