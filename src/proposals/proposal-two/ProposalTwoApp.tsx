import { useEffect, useMemo, useRef, useState } from "react";
import assets from "../../assets.json";
import Avatar from "../../Avatar";
import { isInactive, statusClass } from "../../business";
import {
  companyGroups,
  proposalTwoUsers,
  userById,
  type ProposalTwoUser,
} from "./proposalTwoDemo";
import ProposalTwoChrome from "./ProposalTwoChrome";
import {
  ChevronDown,
  ChevronDownBold,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "./ProposalTwoChevrons";
import ProposalTwoPermissionsEditor from "./ProposalTwoPermissionsEditor";
import "./proposal-two.css";

type ViewBy = "user" | "company";
type Screen = "list" | "search" | "permissions";

const viewByOptions: ViewBy[] = ["user", "company"];

const manageScopeLabels: Record<ViewBy, string> = {
  user: "Users",
  company: "Companies",
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

function ManageScopeHeading({
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
    <h1 className="p2-page-title p2-manage-title">
      Manage{" "}
      <span className="p2-manage-scope" ref={ref}>
        <button
          type="button"
          className="p2-manage-scope-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Manage ${manageScopeLabels[value]}. Change scope.`}
          onClick={onToggle}
        >
          {manageScopeLabels[value]}
          <ChevronDownBold className="p2-manage-scope-chevron" />
        </button>
        {open ? (
          <div
            className="p2-manage-scope-menu"
            role="listbox"
            aria-label="Manage scope"
          >
            {viewByOptions.map((option) => (
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
                {manageScopeLabels[option]}
              </button>
            ))}
          </div>
        ) : null}
      </span>
    </h1>
  );
}

function ListHead({
  viewBy,
  scopeOpen,
  onScopeToggle,
  onViewByChange,
}: {
  viewBy: ViewBy;
  scopeOpen: boolean;
  onScopeToggle: () => void;
  onViewByChange: (v: ViewBy) => void;
}) {
  return (
    <div className="p2-list-head">
      <ManageScopeHeading
        value={viewBy}
        open={scopeOpen}
        onToggle={onScopeToggle}
        onChange={onViewByChange}
      />
      <button type="button" className="primary-button">
        Add a user
        <Icon src={assets.imgMask1} />
      </button>
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
  const factRows: { label: string; value: string; action: string }[] = [
    { label: "Role", value: user.role, action: "Remove user" },
    { label: "Job title", value: user.job, action: "Add authentication" },
  ];

  return (
    <div className="p2-permissions-page">
      <div className="p2-details-header">
        <button type="button" className="p2-details-back" onClick={onBack}>
          <ChevronLeft className="p2-details-back-chevron" />
          <span>All users</span>
        </button>
        <h1 className="p2-details-title">User permissions</h1>
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
              <button type="button" className="p2-fact-action">
                {row.action}
              </button>
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
export default function ProposalTwoApp() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const [screen, setScreen] = useState<Screen>("list");
  const [viewBy, setViewBy] = useState<ViewBy>("user");
  const [scopeOpen, setScopeOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCompanies, setExpandedCompanies] = useState<Record<string, boolean>>(
    {},
  );
  const selectedUser = selectedUserId ? userById(selectedUserId) : undefined;

  const gridUsers = useMemo(() => proposalTwoUsers, []);

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
    setScopeOpen(false);
  };

  const closeUser = () => {
    setSelectedUserId(null);
    setScreen("list");
  };

  const openSearch = () => {
    setScreen("search");
    setSelectedUserId(null);
    setScopeOpen(false);
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
          Skip to user permissions
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
                  aria-label="All users"
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
            <ListHead
              viewBy={viewBy}
              scopeOpen={scopeOpen}
              onScopeToggle={() => setScopeOpen((v) => !v)}
              onViewByChange={setViewBy}
            />

            {viewBy === "user" ? (
              <div className="p2-user-grid">
                {gridUsers.map((user) => (
                  <UserTile key={user.id} user={user} onSelect={openUser} />
                ))}
              </div>
            ) : null}

            {viewBy === "company" ? (
              <div className="p2-company-grid">
                {companyGroups
                  .filter((group) => group.users.length > 0)
                  .map((group) => {
                  const expanded = expandedCompanies[group.id];
                  const previewCount = 4;
                  const visibleUsers = expanded
                    ? group.users
                    : group.users.slice(0, previewCount);
                  const canToggleList = group.users.length > previewCount;
                  return (
                    <article key={group.id} className="p2-company-card">
                      <h2 className="p2-company-head">{group.cardTitle}</h2>
                      <p className="p2-company-count">
                        {group.accountCount} account
                        {group.accountCount === 1 ? "" : "s"}
                      </p>
                      <div className="p2-company-rows">
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
                              <span>
                                <span className="p2-company-user">{user.name}</span>
                                <span className="p2-company-meta">
                                  {row.role} | {row.accountLabel}
                                </span>
                              </span>
                              <ChevronRight className="p2-company-chevron" />
                            </button>
                          );
                        })}
                      </div>
                      {canToggleList ? (
                        <button
                          type="button"
                          className="p2-show-more"
                          aria-expanded={expanded}
                          onClick={() =>
                            setExpandedCompanies((prev) => ({
                              ...prev,
                              [group.id]: !expanded,
                            }))
                          }
                        >
                          <span>{expanded ? "Show less" : "Show more"}</span>
                          {expanded ? (
                            <ChevronUp className="p2-show-more-chevron" />
                          ) : (
                            <ChevronDown className="p2-show-more-chevron" />
                          )}
                        </button>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
