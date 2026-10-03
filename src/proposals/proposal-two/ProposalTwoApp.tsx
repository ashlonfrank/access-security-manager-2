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
type Screen = "list" | "search";

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

function UserDetailPanel({
  user,
  onBack,
}: {
  user: ProposalTwoUser;
  onBack: () => void;
}) {
  const detailActions = [
    "Edit user info",
    "Suspend user",
    "Remove user",
    "Request token",
    "Send temporary password",
    "Copy rights from another user",
  ];

  return (
    <div className="p2-detail-panel">
      <button type="button" className="p2-details-back" onClick={onBack}>
        ‹ Back to all users
      </button>
      <h2 className="p2-details-title">User details</h2>
      <section className="p2-profile-card" aria-labelledby="p2-user-name">
        <h2 id="p2-user-name" className="p2-profile-name">
          {user.name}
        </h2>
        <p className="p2-active">✓ {user.status}</p>
        <dl className="p2-profile-grid">
          <dt>User ID</dt>
          <dd>{user.userId}</dd>
          <dt>Role</dt>
          <dd>{user.role}</dd>
          <dt>Phone number</dt>
          <dd>{user.phone}</dd>
          <dt>Email address</dt>
          <dd>{user.email}</dd>
          <dt>Mobile access</dt>
          <dd>{user.mobileAccess ? "On" : "Off"}</dd>
          <dt>Third-party access</dt>
          <dd>{user.thirdPartyAccess ? "On" : "Off"}</dd>
        </dl>
        <div className="p2-action-links">
          {detailActions.map((label) => (
            <button key={label} type="button">
              {label}
              <span aria-hidden="true">›</span>
            </button>
          ))}
        </div>
      </section>

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
export default function ProposalTwoApp() {
  const [screen, setScreen] = useState<Screen>("list");
  const [viewBy, setViewBy] = useState<ViewBy>("user");
  const [viewByOpen, setViewByOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>(
    {},
  );
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);

  const selectedUser = selectedUserId ? userById(selectedUserId) : undefined;

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
    setViewByOpen(false);
  };

  const closeUser = () => setSelectedUserId(null);

  const openSearch = () => {
    if (viewBy === "company" && screen === "list") {
      setSearchPanelOpen(true);
      setSelectedUserId((id) => id ?? "cameron");
      return;
    }
    setScreen("search");
    setSearchPanelOpen(false);
    setSelectedUserId("cameron");
    setViewByOpen(false);
  };

  const railUsers = useMemo(() => {
    const repeat = (user: ProposalTwoUser, count: number) =>
      Array.from({ length: count }, (_, i) => ({ ...user, id: `${user.id}-r${i}` }));
    return [
      ...repeat(proposalTwoUsers[1], 3),
      ...repeat(proposalTwoUsers[2], 3),
      proposalTwoUsers[0],
    ];
  }, []);

  const denseSearchGrid = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const user = proposalTwoUsers[i % proposalTwoUsers.length];
        return { ...user, key: `search-${i}` };
      }),
    [],
  );

  return (
    <div className="proposal-two">
      <a className="skip-link" href="#proposal-two-main">
        Skip to all users
      </a>
      <ConnectChrome onSearchClick={openSearch} />
      <main className="p2-main" id="proposal-two-main">
        {screen === "search" ? (
          <div className={selectedUser ? "p2-split-3" : "p2-split-2"}>
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
            {selectedUser ? (
              <UserDetailPanel user={selectedUser} onBack={closeUser} />
            ) : null}
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
              selectedUser ? (
                <div className="p2-split-2">
                  <div className="p2-split-list" aria-label="Users">
                    {railUsers.map((user) => {
                      const baseId = user.id.replace(/-r\d+$/, "") || user.id;
                      return (
                        <UserTileCompact
                          key={user.id}
                          user={user}
                          selected={selectedUserId === baseId}
                          onSelect={() => openUser(baseId)}
                        />
                      );
                    })}
                  </div>
                  <UserDetailPanel user={selectedUser} onBack={closeUser} />
                </div>
              ) : (
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
              )
            ) : null}

            {viewBy === "company" ? (
              <div
                className={
                  searchPanelOpen ? "p2-split-2" : "p2-company-grid-wrap"
                }
              >
              <div className="p2-company-grid">
                {companyGroups.map((group) => {
                  const expanded = expandedCompanies[group.id];
                  const visibleUsers = expanded ? group.users : group.users.slice(0, 4);
                  return (
                    <article key={group.id} className="p2-company-card">
                      <h2 className="p2-company-head">
                        {group.name}{" "}
                        <span>
                          ({group.accountCount} account
                          {group.accountCount === 1 ? "" : "s"})
                        </span>
                      </h2>
                      {visibleUsers.map((row) => {
                        const user = userById(row.userId);
                        if (!user) return null;
                        return (
                          <button
                            key={`${group.id}-${row.userId}-${row.accountLabel}`}
                            type="button"
                            className="p2-company-row"
                            onClick={() => openUser(user.id)}
                          >
                            <div>
                              <div className="p2-company-user">{user.name}</div>
                              <div className="p2-company-meta">
                                {row.role} | {row.accountLabel}
                              </div>
                            </div>
                            <span className="p2-chevron" aria-hidden="true">
                              ›
                            </span>
                          </button>
                        );
                      })}
                      {!expanded && group.users.length > 4 ? (
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
              {searchPanelOpen ? (
                <aside className="p2-search-sidebar" aria-label="Search users">
                  <h2>Search authorized users</h2>
                  <label className="p2-search-input-wrap">
                    <span className="visually-hidden">Search authorized users</span>
                    <span aria-hidden="true">⌕</span>
                    <input
                      type="search"
                      placeholder="Search authorized users"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </label>
                  <div className="p2-search-meta" style={{ margin: "12px 0" }}>
                    <span>Sort by: Alphabetical order</span>
                  </div>
                  {searchResults.slice(0, 6).map((user, index) => (
                    <UserTileCompact
                      key={`${user.id}-sb-${index}`}
                      user={user}
                      selected={selectedUserId === user.id}
                      onSelect={openUser}
                    />
                  ))}
                  {selectedUser ? (
                    <div style={{ marginTop: 16 }}>
                      <UserDetailPanel user={selectedUser} onBack={closeUser} />
                    </div>
                  ) : null}
                </aside>
              ) : null}
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
