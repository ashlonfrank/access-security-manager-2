import { useEffect, useMemo, useState } from "react";
import permissionAssets from "../../permission-assets.json";
import type { User } from "../../App";
import {
  accountGroups,
  companyGroups,
  permissionsAccounts,
} from "./proposalTwoDemo";
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

function readPermissions(id: string): Permissions {
  return readStoredPermissions(id);
}

/** Proposal 1 side-panel permission sections, embedded on the Proposal 2 user details page. */
export default function ProposalTwoPermissionsEditor({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<Permissions>(() => readPermissions(user.id));
  const [error, setError] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");

  const accountOptions = useMemo(() => {
    if (companyFilter === "all") return permissionsAccounts;
    const group = accountGroups.find((g) => g.id === `company-${companyFilter}`);
    return group ? [group.label] : permissionsAccounts;
  }, [companyFilter]);

  useEffect(() => {
    setValue(readPermissions(user.id));
    setEditing(false);
    setError("");
  }, [user.id]);

  useEffect(() => {
    setAccountFilter("all");
  }, [companyFilter]);

  function beginEdit() {
    setValue(readPermissions(user.id));
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setValue(readPermissions(user.id));
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
    <EditorContext.Provider value={{ editing, value, setValue }}>
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
          </div>
          <div className="p2-filter">
            <label htmlFor="p2-account">Account number</label>
            <select
              id="p2-account"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="all">All accounts</option>
              {accountOptions.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error ? (
          <p className="permission-feedback error" role="alert">
            {error}
          </p>
        ) : null}
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
    </EditorContext.Provider>
  );
}
