import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { User } from "../../App";
import { ChevronDown } from "./ProposalTwoChevrons";
import { companyIndex, statusClass } from "../../business";
import { formatAccountLabel } from "../../demoAccounts";
import { coffeeCompanies } from "../../business";
import { allAccountsForP2Company } from "./proposalTwoAccounts";
import {
  mergeSavedPermissionsFromEditor,
  permissionsWithCompanyStatements,
  readProposalTwoPermissions,
  saveProposalTwoPermissions,
  seedPermissionsForP2,
} from "./proposalTwoPermissions";
import {
  normalizeP2Role,
  type P2SelectableRole,
} from "./proposalTwoPermissionModel";
import ProposalTwoRolePicker from "./ProposalTwoRolePicker";
import ProposalTwoSolidSelect from "./ProposalTwoSolidSelect";
import type { Permissions } from "../../userPermissions";
import { EditorContext } from "../../permissionUi";
import {
  ProposalTwoPermissionAccountsEditor,
  ProposalTwoPermissionCategoriesEditor,
} from "./proposalTwoPermissionUi";

function readPermissions(user: User) {
  return readProposalTwoPermissions({ id: user.id, role: user.role });
}

const tokenChoices = ["Soft token", "Hard token"] as const;

function authenticationTypeLabel(value: Permissions): string {
  if (!value.mfa) return "No token";
  return value.token === "Hard token" ? "Hard token" : "Soft token";
}

/**
 * Proposal 2 user-details permissions.
 * Company dropdown scopes accounts; Riverside/Roastery demo swaps Account Information only.
 */
export default function ProposalTwoPermissionsEditor({ user }: { user: User }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(() => readPermissions(user));
  const [editRole, setEditRole] = useState<P2SelectableRole>(() =>
    normalizeP2Role(readPermissions(user).p2Role ?? user.role),
  );
  const [error, setError] = useState("");
  const [companyFilter, setCompanyFilter] = useState(() =>
    String(companyIndex(user.id)),
  );
  const [accountFilter, setAccountFilter] = useState("all");

  const companyIdx = useMemo(() => {
    const parsed = Number(companyFilter);
    return Number.isFinite(parsed) ? parsed : companyIndex(user.id);
  }, [companyFilter]);

  const contextualValue = useMemo(
    () => permissionsWithCompanyStatements(value, companyIdx, user.id),
    [value, companyIdx, user.id],
  );

  const accountOptions = useMemo(
    () => allAccountsForP2Company(companyIdx),
    [companyIdx],
  );

  const setContextualValue: Dispatch<SetStateAction<Permissions>> = useCallback(
    (action) => {
      setValue((stored) => {
        const current = permissionsWithCompanyStatements(
          stored,
          companyIdx,
          user.id,
        );
        const next =
          typeof action === "function" ? action(current) : action;
        return mergeSavedPermissionsFromEditor(stored, next, companyIdx);
      });
    },
    [companyIdx, user.id],
  );

  useEffect(() => {
    const next = readPermissions(user);
    setValue(next);
    setEditRole(normalizeP2Role(next.p2Role ?? user.role));
    setEditing(false);
    setError("");
    setCompanyFilter(String(companyIndex(user.id)));
  }, [user.id, user.role]);

  useEffect(() => {
    setAccountFilter("all");
  }, [companyFilter]);

  function beginEdit() {
    const next = readPermissions(user);
    setValue(next);
    setEditRole(normalizeP2Role(next.p2Role ?? user.role));
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    const next = readPermissions(user);
    setValue(next);
    setEditRole(normalizeP2Role(next.p2Role ?? user.role));
    setEditing(false);
    setError("");
  }

  function handleRoleChange(nextRole: P2SelectableRole) {
    setEditRole(nextRole);
    setValue(seedPermissionsForP2({ id: user.id, role: user.role }, nextRole));
  }

  function save() {
    try {
      saveProposalTwoPermissions(user.id, { ...value, p2Role: editRole });
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
        value: contextualValue,
        setValue: setContextualValue,
        userId: user.id,
        role: editRole,
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
            options={coffeeCompanies.map((company, index) => ({
              value: String(index),
              label: `${company.name} ${company.location}`,
            }))}
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
              <div className="p2-role-field">
                <dt id="p2-permissions-role-label">Role</dt>
                <dd aria-labelledby="p2-permissions-role-label">
                  {editing ? (
                    <ProposalTwoRolePicker
                      value={editRole}
                      onChange={handleRoleChange}
                    />
                  ) : (
                    <span className="permission-small-tag">{editRole}</span>
                  )}
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
                  checked={contextualValue.mfa}
                  onChange={(event) => {
                    const mfa = event.target.checked;
                    setContextualValue((prev) => ({
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
              {contextualValue.mfa ? (
                <fieldset>
                  <legend>Authentication type</legend>
                  {tokenChoices.map((token) => (
                    <label className="permission-option" key={token}>
                      <input
                        type="radio"
                        name={`token-p2-${user.id}`}
                        checked={contextualValue.token === token}
                        onChange={() =>
                          setContextualValue({ ...contextualValue, token })
                        }
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
                <dd>{contextualValue.mfa ? "Enabled" : "Disabled"}</dd>
              </div>
              <div>
                <dt>Authentication type</dt>
                <dd>
                  <span className="permission-small-tag">
                    {authenticationTypeLabel(contextualValue)}
                  </span>
                </dd>
              </div>
            </dl>
          )}
          </section>
          <ProposalTwoPermissionCategoriesEditor />
          <ProposalTwoPermissionAccountsEditor />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
