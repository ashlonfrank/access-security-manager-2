import { useEffect, useMemo, useState } from "react";
import permissionAssets from "../../permission-assets.json";
import type { User } from "../../App";
import { companyIndex, statusClass } from "../../business";
import {
  formatAccountLabel,
  visibleAccountsForUser,
} from "../../demoAccounts";
import { ChevronDown } from "./ProposalTwoChevrons";
import { companyGroups } from "./proposalTwoDemo";
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
                <img src={permissionAssets.imgMask} alt="" />
              </button>
            )}
          </div>
        </div>
        <div className="p2-filters">
          <div className="p2-filter">
            <label htmlFor="p2-company">Company name</label>
            <div className="p2-select-wrap">
              <select
                id="p2-company"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              >
                <option value="all">All companies</option>
                {companyGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="p2-select-chevron" />
            </div>
          </div>
          <div className="p2-filter">
            <label htmlFor="p2-account">Account number</label>
            <div className="p2-select-wrap">
              <select
                id="p2-account"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
              >
                <option value="all">All accounts</option>
                {accountOptions.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAccountLabel(account, user.id)}
                  </option>
                ))}
              </select>
              <ChevronDown className="p2-select-chevron" />
            </div>
          </div>
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
                  onChange={(event) => setValue({ ...value, mfa: event.target.checked })}
                />
                Multi-factor authentication
              </label>
              <fieldset>
                <legend>Authentication type</legend>
                {(["Soft token", "Hard token", "No token"] as const).map((token) => (
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
                  <span className="permission-small-tag">{value.token}</span>
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
