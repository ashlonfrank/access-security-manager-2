import { useEffect, useState } from "react";
import permissionAssets from "../../permission-assets.json";
import type { User } from "../../App";
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

  useEffect(() => {
    setValue(readPermissions(user.id));
    setEditing(false);
    setError("");
  }, [user.id]);

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
