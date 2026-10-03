import { useEffect, useMemo, useRef, useState } from "react";
import assets from "../../assets.json";
import Avatar from "../../Avatar";
import { isInactive, statusClass } from "../../business";
import {
  accountGroups,
  companyGroups,
  defaultPermissionsUserId,
  proposalTwoUsers,
  userById,
  type ProposalTwoUser,
} from "./proposalTwoDemo";
import ProposalTwoChrome from "./ProposalTwoChrome";
import { ChevronDown, ChevronRight } from "./ProposalTwoChevrons";
import ProposalTwoPermissionsEditor from "./ProposalTwoPermissionsEditor";
import "./proposal-two.css";

type ViewBy = "user" | "account" | "company";
type Screen = "list" | "search" | "permissions";

const viewByLabels: Record<ViewBy, string> = {
  user: "By user",
  account: "By account",
  company: "By company",
};

function Icon({ src }: { src: string }) {
  return <img src={src} alt="" />;
}

function UserStatusRole({ user }: { user: ProposalTwoUser }) {
  return (
    <div className="p2-tag-row">
      <span className={`tag status-tag ${statusClass(user.status)}`}>
        {isInactive(user.status) ? "Removed" : user.status}
      </span>
      <span
        className={`tag role-tag ${isInactive(user.status) ? "inactive-role" : ""}`}
      >
        {isInactive(user.status) ? "N/A" : user.role}
      </span>
    </div>
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
      <UserStatusRole user={user} />
      <div className="p2-contact">
        <div>{user.job}</div>
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
        <Avatar user={user} />
        <ChevronRight className="p2-chevron" />
      </div>
      <p className="p2-tile-name">{user.name}</p>
      <UserStatusRole user={user} />
      <div className="p2-contact">
        <div>{user.job}</div>
        <div>{user.email}</div>
      </div>
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
        <span className="p2-view-by-label">
          View by
          <strong>{viewByLabels[value]}</strong>
        </span>
        <ChevronDown />
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
      <div className="p2-toolbar-actions">
        <button type="button" className="primary-button">
          Add a user
          <Icon src={assets.imgMask1} />
        </button>
      </div>
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
  const factRows: {
    label: string;
    value: string;
    action: string;
    showChevron: boolean;
  }[] = [
    { label: "Role", value: user.role, action: "Remove user", showChevron: true },
    { label: "Job title", value: user.job, action: "Edit user info", showChevron: true },
    {
      label: "Email address",
      value: user.email,
      action: "Add authentication",
      showChevron: false,
    },
  ];

  return (
    <div className="p2-permissions-page">
      <div className="p2-details-header">
        <button type="button" className="p2-details-back" onClick={onBack}>
          ‹ Back to all users
        </button>
        <h1 className="p2-details-title">User details</h1>
      </div>
      <section className="p2-profile-card" aria-labelledby="p2-user-name">
        <h2 id="p2-user-name" className="p2-profile-name">
          {user.name}
        </h2>
        <p className="p2-profile-status">
          <span className={`tag status-tag ${statusClass(user.status)}`}>
            {user.status}
          </span>
        </p>
        <div className="p2-fact-rows">
          {factRows.map((row) => (
            <div key={row.label} className="p2-fact-row">
              <div className="p2-fact-row-label">
                <span className="p2-fact-term">{row.label}</span>
                <span className="p2-fact-value">{row.value}</span>
              </div>
              {row.showChevron ? (
                <button type="button" className="p2-fact-action">
                  {row.action}
                  <ChevronRight />
                </button>
              ) : (
                <span className="p2-fact-action p2-fact-action-text">{row.action}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="p2-rights-section">
        <ProposalTwoPermissionsEditor user={user} />
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
  return (
    params.get("user") ??
    (params.get("view") === "permissions" ? defaultPermissionsUserId : null)
  );
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
    const seed = proposalTwoUsers.slice(0, 2);
    return seed.flatMap((user) =>
      Array.from({ length: 2 }, (_, i) => ({ ...user, id: `${user.id}-l${i}` })),
    );
  }, []);

  const sidebarTiles = useMemo(
    () =>
      proposalTwoUsers.slice(0, 5).map((user, index) => ({
        ...user,
        key: `sb-${user.id}-${index}`,
      })),
    [],
  );

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
      `${u.name} ${u.email} ${u.job} ${u.role}`.toLowerCase().includes(q),
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

  const openUserFromRail = (id: string) => {
    openUser(id.replace(/-l\d+$/, ""));
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
        <ProposalTwoChrome />
        <main className="p2-main p2-main-permissions" id="proposal-two-main">
          <UserPermissionsPage user={selectedUser} onBack={closeUser} />
        </main>
      </div>
    );
  }

  return (
    <div className="proposal-two">
      <a className="skip-link" href="#proposal-two-main">
        Skip to all users
      </a>
      <ProposalTwoChrome />
      <main className="p2-main" id="proposal-two-main">
        {screen === "search" ? (
          <div className="p2-split-3">
            <aside className="p2-company-rail" aria-label="Company context">
              {companyGroups
                .filter((g) => g.id === "3")
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
                    Show all <ChevronDown />
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
                      onSelect={openUserFromRail}
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
                                  {row.role} | {row.accountLabel}
                                </div>
                              </div>
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
                      onSelect={(id) => openUser(id)}
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
    </div>
  );
}
