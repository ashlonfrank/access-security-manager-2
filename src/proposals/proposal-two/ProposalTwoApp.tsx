import { useEffect, useMemo, useRef, useState } from "react";
import {
  accountGroups,
  cameronRightsAccounts,
  companyGroups,
  proposalTwoUsers,
  userById,
  type ProposalTwoUser,
} from "./proposalTwoDemo";
import "./proposal-two.css";

type ViewBy = "user" | "account" | "company";
type Screen = "list" | "search" | "permissions";

const viewByLabels: Record<ViewBy, string> = {
  user: "By user",
  account: "By account",
  company: "By company",
};

function ConnectChrome({
  asmTab = "all-users",
  onSearchClick,
}: {
  asmTab?: string;
  onSearchClick?: () => void;
}) {
  return (
    <header className="p2-connect-header">
      <div className="p2-top-bar">
        <div className="p2-logo">
          CHASE <span>CONNECT</span>
        </div>
        <nav className="p2-global-nav" aria-label="Global">
          <button type="button">Accounts</button>
          <button type="button">Pay &amp; Transfer</button>
          <button type="button">Collect &amp; deposit</button>
          <button type="button" aria-current="page">
            Account management
          </button>
          <button type="button">Security</button>
        </nav>
        <div className="p2-top-actions">
          <button
            type="button"
            className="p2-icon-btn"
            aria-label="Search"
            onClick={onSearchClick}
          >
            ⌕
          </button>
          <button type="button" className="p2-icon-btn" aria-label="Security center">
            ◈
          </button>
          <button
            type="button"
            className="p2-icon-btn p2-badge-dot"
            aria-label="Notifications, 5 unread"
          >
            ✉
          </button>
          <button type="button" className="p2-icon-btn" aria-label="Profile">
            👤
          </button>
          <button type="button" className="p2-outline-btn">
            Open an account
          </button>
          <button type="button">Sign out</button>
        </div>
      </div>
      <div className="p2-asm-bar">
        <div className="p2-asm-title">Access and Security Manager</div>
        <nav className="p2-asm-tabs" aria-label="Access and Security Manager">
          <button type="button" aria-current={asmTab === "all-users" ? "page" : undefined}>
            All users
          </button>
          <button type="button">Account activity</button>
          <button type="button">Chase Dual Control</button>
          <button type="button">IP Security</button>
          <button type="button">Demos and user guides</button>
        </nav>
      </div>
    </header>
  );
}

function UserTileCompact({
  user,
  selected,
  onSelect,
}: {
  user: ProposalTwoUser;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="p2-user-tile-compact"
      aria-current={selected ? "true" : undefined}
      onClick={() => onSelect(user.id)}
    >
      <p className="p2-tile-name">{user.name}</p>
      <div className="p2-status-row">
        <span className="p2-active">✓ {user.status}</span>
        <span className="p2-role-divider">|</span>
        <span className="p2-role-label">{user.role}</span>
      </div>
      <div className="p2-contact">
        <div>{user.phone}</div>
        <div>{user.email}</div>
      </div>
    </button>
  );
}

function UserTile({
  user,
  onSelect,
}: {
  user: ProposalTwoUser;
  onSelect: (id: string) => void;
}) {
  return (
    <button type="button" className="p2-user-tile" onClick={() => onSelect(user.id)}>
      <div className="p2-tile-top">
        <span className="p2-avatar-badge" aria-hidden="true">
          ◉
        </span>
        <span className="p2-chevron" aria-hidden="true">
          ›
        </span>
      </div>
      <p className="p2-tile-name">{user.name}</p>
      <div className="p2-status-row">
        <span className="p2-active">✓ {user.status}</span>
        <span className="p2-role-divider">|</span>
        <span className="p2-role-label">{user.role}</span>
      </div>
      <div className="p2-contact">
        <div>{user.phone}</div>
        <div>{user.email}</div>
      </div>
      {user.dualControl ? (
        <div className="p2-dual">Dual Control Active</div>
      ) : null}
    </button>
  );
}

function ViewByControl({
  value,
  open,
  onToggle,
  onChange,
}: {
  value: ViewBy;
  open: boolean;
  onToggle: () => void;
  onChange: (v: ViewBy) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onToggle]);

  return (
    <div className="p2-view-by" ref={ref}>
      <button type="button" className="p2-view-by-trigger" onClick={onToggle}>
        View by
        <strong>{viewByLabels[value]}</strong>
      </button>
      {open ? (
        <div className="p2-view-menu" role="listbox" aria-label="View by">
          {(["user", "account", "company"] as ViewBy[]).map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                onToggle();
              }}
            >
              {viewByLabels[option]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ListToolbar({
  viewBy,
  viewByOpen,
  onViewByToggle,
  onViewByChange,
}: {
  viewBy: ViewBy;
  viewByOpen: boolean;
  onViewByToggle: () => void;
  onViewByChange: (v: ViewBy) => void;
}) {
  return (
    <div className="p2-toolbar">
      <ViewByControl
        value={viewBy}
        open={viewByOpen}
        onToggle={onViewByToggle}
        onChange={onViewByChange}
      />
      <div className="p2-action-row">
        <button type="button" className="p2-action-btn">
          + Add authorized user
        </button>
        <button type="button" className="p2-action-btn">
          Assign user rights
        </button>
        <button type="button" className="p2-action-btn">
          Copy user rights
        </button>
      </div>
    </div>
  );
}

type UserMoreAction = "remove" | "temp-password" | "deactivate";

const userMoreMenuLabels: Record<UserMoreAction, string> = {
  remove: "Remove user",
  "temp-password": "Send temporary password",
  deactivate: "Deactivate user",
};

function UserMoreMenu({
  userName,
  onAction,
}: {
  userName: string;
  onAction: (action: UserMoreAction) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = "p2-user-more-menu";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const run = (action: UserMoreAction) => {
    onAction(action);
    setOpen(false);
  };

  return (
    <div className="p2-user-more" ref={ref}>
      <button
        type="button"
        className="p2-more-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="visually-hidden">More actions for {userName}</span>
        <span aria-hidden="true">More</span>
        <span className="p2-more-ellipsis" aria-hidden="true">
          ⋯
        </span>
      </button>
      {open ? (
        <ul className="p2-more-menu" id={menuId} role="menu" aria-label={`More actions for ${userName}`}>
          {(Object.keys(userMoreMenuLabels) as UserMoreAction[]).map((action) => (
            <li key={action} role="none">
              <button
                type="button"
                role="menuitem"
                className={action === "remove" ? "p2-more-menu-danger" : undefined}
                onClick={() => run(action)}
              >
                {userMoreMenuLabels[action]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Figma 77:19563 — full-page user permissions (no side panel). */
function UserPermissionsPage({
  user,
  onBack,
}: {
  user: ProposalTwoUser;
  onBack: () => void;
}) {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const factRows: { label: string; value: string }[] = [
    { label: "User ID", value: user.userId },
    { label: "Role", value: user.role },
    { label: "Phone number", value: user.phone },
    { label: "Email address", value: user.email },
    {
      label: "Mobile access",
      value: user.mobileAccess ? "On" : "Off",
    },
    {
      label: "Third-party access",
      value: user.thirdPartyAccess ? "On" : "Off",
    },
  ];

  const onMoreAction = (action: UserMoreAction) => {
    const label = userMoreMenuLabels[action];
    setToast(`${label} — demo action for ${user.name}`);
  };

  return (
    <div className="p2-permissions-page">
      <button type="button" className="p2-details-back" onClick={onBack}>
        ‹ Back to all users
      </button>
      <h1 className="p2-details-title">User details</h1>
      <section className="p2-profile-card" aria-labelledby="p2-user-name">
        <div className="p2-profile-head">
          <div>
            <h2 id="p2-user-name" className="p2-profile-name">
              {user.name}
            </h2>
            <p className="p2-active">✓ {user.status}</p>
          </div>
          <UserMoreMenu userName={user.name} onAction={onMoreAction} />
        </div>
        <div className="p2-fact-rows">
          {factRows.map((row) => (
            <div key={row.label} className="p2-fact-row">
              <div className="p2-fact-row-label">
                <span className="p2-fact-term">{row.label}</span>
                <span className="p2-fact-value">{row.value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {toast ? (
        <div className="toast" role="status" aria-live="polite">
          <span>{toast}</span>
        </div>
      ) : null}

      <section className="p2-rights-section" aria-labelledby="p2-rights-heading">
        <div className="p2-rights-head">
          <h2 id="p2-rights-heading">Manage user rights</h2>
          <button type="button">Expand all accounts ⇅</button>
        </div>
        <div className="p2-filters">
          <div className="p2-filter">
            <label htmlFor="p2-company">Company name</label>
            <select id="p2-company" defaultValue="yale">
              <option value="yale">YALE</option>
            </select>
          </div>
          <div className="p2-filter">
            <label htmlFor="p2-account">Account number</label>
            <select id="p2-account" defaultValue="all">
              <option value="all">All accounts</option>
            </select>
          </div>
          <div className="p2-filter">
            <label htmlFor="p2-service">Service</label>
            <select id="p2-service" defaultValue="">
              <option value="">Choose service</option>
            </select>
          </div>
        </div>
        <article className="p2-rights-card">
          <h3>YALE</h3>
          <p>Company-level rights</p>
          <ul>
            <li>Open accounts</li>
            <li>See, upload, and download account opening documents</li>
          </ul>
          <footer>
            <span aria-hidden="true">?</span>
            <button type="button">Edit</button>
          </footer>
        </article>
        <div className="p2-account-accordion">
          {cameronRightsAccounts.map((label) => (
            <button key={label} type="button">
              <span aria-hidden="true">›</span>
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Figma section 77 — Chase Connect tile dashboard (Proposal 2). */
function readInitialViewBy(): ViewBy {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "company" || view === "account" || view === "user") return view;
  return "user";
}

function readInitialScreen(): Screen {
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "permissions" || params.get("user")) return "permissions";
  return "list";
}

function readInitialUserId(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("user") ?? (params.get("view") === "permissions" ? "cameron" : null);
}

export default function ProposalTwoApp() {
  const [screen, setScreen] = useState<Screen>(readInitialScreen);
  const [viewBy, setViewBy] = useState<ViewBy>(readInitialViewBy);
  const [viewByOpen, setViewByOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(readInitialUserId);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>(
    {},
  );
  const selectedUser = selectedUserId ? userById(selectedUserId) : undefined;

  const leftRailUsers = useMemo(() => {
    const james = proposalTwoUsers.find((u) => u.id === "james");
    if (!james) return [];
    return Array.from({ length: 4 }, (_, i) => ({ ...james, id: `james-l${i}` }));
  }, []);

  const sidebarTiles = useMemo(() => {
    const cameron = proposalTwoUsers[0];
    return Array.from({ length: 5 }, (_, i) => ({
      ...cameron,
      role: "Authorized user" as const,
      key: `cam-sb-${i}`,
    }));
  }, []);

  const gridUsers = useMemo(() => {
    const base = showAllUsers
      ? [...proposalTwoUsers, ...proposalTwoUsers.slice(0, 3)]
      : proposalTwoUsers.slice(0, 10);
    if (viewBy === "user") return base;
    return proposalTwoUsers;
  }, [showAllUsers, viewBy]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return proposalTwoUsers;
    return proposalTwoUsers.filter((u) =>
      `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const openUser = (id: string) => {
    setSelectedUserId(id);
    setScreen("permissions");
    setViewByOpen(false);
  };

  const closeUser = () => {
    setSelectedUserId(null);
    setScreen("list");
  };

  const openSearch = () => {
    if (viewBy === "company" && screen === "list") {
      document.getElementById("p2-company-search")?.focus();
      return;
    }
    setScreen("search");
    setSelectedUserId(null);
    setViewByOpen(false);
  };

  const denseSearchGrid = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const user = proposalTwoUsers[i % proposalTwoUsers.length];
        return { ...user, key: `search-${i}` };
      }),
    [],
  );

  if (screen === "permissions" && selectedUser) {
    return (
      <div className="proposal-two">
        <a className="skip-link" href="#proposal-two-main">
          Skip to user details
        </a>
        <ConnectChrome onSearchClick={openSearch} />
        <main className="p2-main p2-main-permissions" id="proposal-two-main">
          <UserPermissionsPage user={selectedUser} onBack={closeUser} />
        </main>
        <BaselineLink />
      </div>
    );
  }

  return (
    <div className="proposal-two">
      <a className="skip-link" href="#proposal-two-main">
        Skip to all users
      </a>
      <ConnectChrome onSearchClick={openSearch} />
      <main className="p2-main" id="proposal-two-main">
        {screen === "search" ? (
          <div className="p2-split-3">
            <aside className="p2-company-rail" aria-label="Company context">
              {companyGroups
                .filter((g) => g.id === "dane")
                .map((group) => (
                  <article key={group.id} className="p2-company-card">
                    <h2 className="p2-company-head">
                      {group.name}{" "}
                      <span>({group.accountCount} accounts)</span>
                    </h2>
                    {group.users.slice(0, 4).map((row) => {
                      const user = userById(row.userId);
                      if (!user) return null;
                      return (
                        <div key={row.userId} className="p2-company-row">
                          <div className="p2-company-user">{user.name.split(" ").pop()}</div>
                        </div>
                      );
                    })}
                    <button type="button" className="p2-show-more">
                      Show more
                    </button>
                  </article>
                ))}
            </aside>
            <div>
              <div className="p2-search-bar">
                <button
                  type="button"
                  className="p2-back-btn"
                  aria-label="Back to all users"
                  onClick={() => {
                    setScreen("list");
                    closeUser();
                  }}
                >
                  ‹
                </button>
                <label className="p2-search-input-wrap">
                  <span className="visually-hidden">Search authorized users</span>
                  <span aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    placeholder="Search authorized users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </label>
                <div className="p2-search-meta">
                  <span>Sort by: Alphabetical order</span>
                  <span>Filter by: All</span>
                </div>
              </div>
              <div className="p2-user-grid">
                {denseSearchGrid.map((user) => (
                  <UserTile key={user.key} user={user} onSelect={openUser} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="p2-page-title">All users</h1>
            <ListToolbar
              viewBy={viewBy}
              viewByOpen={viewByOpen}
              onViewByToggle={() => setViewByOpen((v) => !v)}
              onViewByChange={setViewBy}
            />

            {viewBy === "user" ? (
              <>
                <div className="p2-user-grid">
                  {gridUsers.map((user, index) => (
                    <UserTile
                      key={`${user.id}-${index}`}
                      user={user}
                      onSelect={openUser}
                    />
                  ))}
                </div>
                {!showAllUsers ? (
                  <button
                    type="button"
                    className="p2-show-all"
                    onClick={() => setShowAllUsers(true)}
                  >
                    Show all <span aria-hidden="true">⌄</span>
                  </button>
                ) : null}
              </>
            ) : null}

            {viewBy === "company" ? (
              <div className="p2-by-company-stage">
                <aside className="p2-left-rail" aria-label="Recent users">
                  {leftRailUsers.map((user) => (
                    <UserTileCompact
                      key={user.id}
                      user={user}
                      selected={false}
                      onSelect={() => openUser("james")}
                    />
                  ))}
                </aside>
                <div className="p2-company-grid">
                  {companyGroups.map((group) => {
                    const expanded = expandedCompanies[group.id];
                    const visibleUsers = expanded
                      ? group.users
                      : group.users.slice(0, 6);
                    return (
                      <article key={group.id} className="p2-company-card">
                        <h2 className="p2-company-head">
                          {group.name}{" "}
                          <span>
                            ({group.accountCount} account
                            {group.accountCount === 1 ? "" : "s"})
                          </span>
                        </h2>
                        {visibleUsers.map((row, rowIndex) => {
                          const user = userById(row.userId);
                          if (!user) return null;
                          const roleLabel =
                            row.role === "Proxy admin" ? "Proxy Admin" : row.role;
                          return (
                            <button
                              key={`${group.id}-${row.userId}-${rowIndex}`}
                              type="button"
                              className="p2-company-row"
                              onClick={() => openUser(user.id)}
                            >
                              <div>
                                <div className="p2-company-user">{user.name}</div>
                                <div className="p2-company-meta">
                                  {roleLabel} | {row.accountLabel}
                                </div>
                              </div>
                              <span className="p2-chevron" aria-hidden="true">
                                ›
                              </span>
                            </button>
                          );
                        })}
                        {!expanded && group.users.length > 6 ? (
                          <button
                            type="button"
                            className="p2-show-more"
                            onClick={() =>
                              setExpandedCompanies((prev) => ({
                                ...prev,
                                [group.id]: true,
                              }))
                            }
                          >
                            Show more
                          </button>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
                <aside className="p2-search-sidebar" aria-label="Search users">
                  <label className="p2-search-input-wrap">
                    <span className="visually-hidden">Search authorized users</span>
                    <span aria-hidden="true">⌕</span>
                    <input
                      id="p2-company-search"
                      type="search"
                      placeholder="Search authorized users"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </label>
                  {sidebarTiles.map((user) => (
                    <UserTile
                      key={user.key}
                      user={user}
                      onSelect={() => openUser("cameron")}
                    />
                  ))}
                </aside>
              </div>
            ) : null}

            {viewBy === "account" ? (
              <div className="p2-account-grid">
                {accountGroups.map((group) => (
                  <article key={group.id} className="p2-company-card">
                    <h2 className="p2-company-head">{group.label}</h2>
                    {group.users.map((row) => {
                      const user = userById(row.userId);
                      if (!user) return null;
                      return (
                        <button
                          key={`${group.id}-${row.userId}`}
                          type="button"
                          className="p2-company-row"
                          onClick={() => openUser(user.id)}
                        >
                          <div>
                            <div className="p2-company-user">{user.name}</div>
                            <div className="p2-company-meta">{row.role}</div>
                          </div>
                          <span className="p2-chevron" aria-hidden="true">
                            ›
                          </span>
                        </button>
                      );
                    })}
                  </article>
                ))}
              </div>
            ) : null}
          </>
        )}
      </main>
      <BaselineLink />
    </div>
  );
}

function BaselineLink() {
  return (
    <a
      className="p2-baseline-link"
      href={window.location.pathname}
      onClick={(e) => {
        e.preventDefault();
        window.location.assign(window.location.pathname);
      }}
    >
      Baseline app
    </a>
  );
}
