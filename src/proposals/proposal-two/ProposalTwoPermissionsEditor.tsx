import { useEffect, useMemo, useState } from "react";
import type { User } from "../../App";
import { ChevronDown } from "./ProposalTwoChevrons";
import { companyIndex, statusClass } from "../../business";
import {
  formatAccountLabel,
  visibleAccountsForUser,
} from "../../demoAccounts";
import { companyGroups } from "./proposalTwoDemo";
import ProposalTwoSolidSelect from "./ProposalTwoSolidSelect";
import {
  readStoredPermissions,
  permissionsStorageKey,
  type Permissions,
} from "../../userPermissions";
import {
  EditorContext,
  PermissionAccountsEditor,
  PermissionCategoriesEditor,
} from "../../permissionUi";

function readPermissions(user: User): Permissions {
  return readStoredPermissions({ id: user.id, role: user.role });
}

const tokenChoices = ["Soft token", "Hard token"] as const;

function authenticationTypeLabel(value: Permissions): string {
  if (!value.mfa) return "No token";
  return value.token === "Hard token" ? "Hard token" : "Soft token";
}

/**
 * Proposal 2 user-details permissions.
 * Demo hierarchy: company → account options (dropdown). Entitlements below stay
 * role-based like Proposal 1 and do not filter by selected account (kept separate for demo).
 */
export default function ProposalTwoPermissionsEditor({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<Permissions>(() => readPermissions(user));
  const [error, setError] = useState("");
  const [companyFilter, setCompanyFilter] = useState(() =>
    String(companyIndex(user.id)),
  );
  const [accountFilter, setAccountFilter] = useState("all");

  const companyIdx = useMemo(() => {
    if (companyFilter === "all") return companyIndex(user.id);
    const parsed = Number(companyFilter);
    return Number.isFinite(parsed) ? parsed : companyIndex(user.id);
  }, [companyFilter, user.id]);

  const accountOptions = useMemo(
    () => visibleAccountsForUser(user.id, user.role, value, companyIdx),
    [user.id, user.role, value, companyIdx],
  );

  useEffect(() => {
    setValue(readPermissions(user));
    setEditing(false);
    setError("");
    setCompanyFilter(String(companyIndex(user.id)));
  }, [user.id, user.role]);

  useEffect(() => {
    setAccountFilter("all");
  }, [companyFilter]);

  function beginEdit() {
    setValue(readPermissions(user));
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setValue(readPermissions(user));
    setEditing(false);
    setError("");
  }

  function save() {
    try {
      localStorage.setItem(permissionsStorageKey(user.id), JSON.stringify(value));
    } catch {
      setError("Changes could not be saved. Please try again.");
      return;
    }
    setEditing(false);
    setError("");
  }

  return (
    <EditorContext.Provider
      value={{
        editing,
        value,
        setValue,
        userId: user.id,
        role: user.role,
        companyIndex: companyIdx,
      }}
    >
      <div
        className={`p2-embedded-permissions permissions-panel ${editing ? "editing-permissions" : ""}`}
        aria-label={`Permissions for ${user.name}`}
      >
        <div className="p2-rights-head">
          <h2 id="p2-rights-heading">Manage user rights</h2>
          <div className="p2-rights-head-actions">
            {editing ? (
              <>
                <button type="button" className="permission-edit primary-button" onClick={save}>
                  Save changes
                </button>
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="permission-edit" onClick={beginEdit}>
                Edit
                <ChevronDown className="p2-edit-chevron" />
              </button>
            )}
          </div>
        </div>
        <div className="p2-filters">
          <ProposalTwoSolidSelect
            id="p2-company"
            label="Company name"
            value={companyFilter}
            onChange={setCompanyFilter}
            options={[
              { value: "all", label: "All companies" },
              ...companyGroups.map((group) => ({
                value: group.id,
                label: group.name,
              })),
            ]}
          />
          <ProposalTwoSolidSelect
            id="p2-account"
            label="Account number"
            value={accountFilter}
            onChange={setAccountFilter}
            options={[
              { value: "all", label: "All accounts" },
              ...accountOptions.map((account) => ({
                value: account.id,
                label: formatAccountLabel(account, user.id),
              })),
            ]}
          />
        </div>
        <div
          className="permissions-scroll p2-permissions-scroll"
          tabIndex={0}
          aria-label={`Permissions for ${user.name}`}
        >
          {error ? (
            <p className="permission-feedback error" role="alert">
              {error}
            </p>
          ) : null}
          <section className="permission-info">
            <div className="permission-info-heading">
              <h3>User info</h3>
            </div>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>
                  <span className="permission-small-tag">{user.role}</span>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`tag status-tag ${statusClass(user.status)}`}>
                    {user.status}
                  </span>
                </dd>
              </div>
            </dl>
          </section>
          <section className="permission-info">
            <h3>User authentication</h3>
          {editing ? (
            <div className="authentication-editor">
              <label className="permission-option">
                <input
                  className="permission-checkbox"
                  type="checkbox"
                  checked={value.mfa}
                  onChange={(event) => {
                    const mfa = event.target.checked;
                    setValue((prev) => ({
                      ...prev,
                      mfa,
                      token: mfa
                        ? prev.token === "No token"
                          ? "Soft token"
                          : prev.token
                        : "No token",
                    }));
                  }}
                />
                Multi-factor authentication
              </label>
              {value.mfa ? (
                <fieldset>
                  <legend>Authentication type</legend>
                  {tokenChoices.map((token) => (
                    <label className="permission-option" key={token}>
                      <input
                        type="radio"
                        name={`token-p2-${user.id}`}
                        checked={value.token === token}
                        onChange={() => setValue({ ...value, token })}
                      />
                      {token}
                    </label>
                  ))}
                </fieldset>
              ) : null}
            </div>
          ) : (
            <dl>
              <div>
                <dt>Multi-factor authentication</dt>
                <dd>{value.mfa ? "Enabled" : "Disabled"}</dd>
              </div>
              <div>
                <dt>Authentication type</dt>
                <dd>
                  <span className="permission-small-tag">
                    {authenticationTypeLabel(value)}
                  </span>
                </dd>
              </div>
            </dl>
          )}
          </section>
          <PermissionCategoriesEditor />
          <PermissionAccountsEditor />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
