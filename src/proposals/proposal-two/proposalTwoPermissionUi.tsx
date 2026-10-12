import { Fragment, useContext, type ReactNode } from "react";
import assets from "../../permission-assets.json";
import { formatAccountLabel } from "../../demoAccounts";
import type { Permissions } from "../../userPermissions";
import { allAccountsForP2Company } from "./proposalTwoAccounts";
import { EditorContext } from "../../permissionUi";
import {
  P2_ACCOUNT_INFORMATION,
  P2_CREDIT_CARDS,
  P2_MERCHANT_SERVICES,
  P2_MONEY_LIMIT_TYPES,
  applyP2MoneyToggleDefaults,
  p2ApprovalKey,
} from "./proposalTwoPermissionModel";

function PermissionToggle({
  text,
  limit = false,
  showApproval = false,
}: {
  text: string;
  limit?: boolean;
  showApproval?: boolean;
}) {
  const ctx = useContext(EditorContext);
  if (!ctx) return null;
  const { editing, value, setValue } = ctx;
  const allowed = value.allowed[text] ?? false;

  return (
    <li className={`permission-item ${limit ? "with-limit" : ""}`}>
      {editing ? (
        <input
          type="checkbox"
          className="permission-checkbox"
          aria-label={text}
          checked={allowed}
          onChange={(event) => {
            const checked = event.target.checked;
            setValue((previous) =>
              showApproval || limit
                ? applyP2MoneyToggleDefaults(previous, text, checked)
                : {
                    ...previous,
                    allowed: { ...previous.allowed, [text]: checked },
                  },
            );
          }}
        />
      ) : (
        <span
          className={`permission-state-icon ${allowed ? "allowed" : "denied"}`}
          role="img"
          aria-label={allowed ? "Allowed" : "Not allowed"}
          style={{
            maskImage: `url(${allowed ? assets.imgSuccessIcoCheckmark : assets.imgActionIcoClose})`,
          }}
        />
      )}
      <span>{text}</span>
      {limit && allowed ? (
        <>
          <span className="daily-limit">Daily limit</span>
          {editing ? (
            <input
              className="limit-input"
              type="number"
              min="0"
              max="999999999"
              step="0.01"
              inputMode="decimal"
              required
              aria-label={`${text} daily limit`}
              value={value.limits[text] ?? "50000.00"}
              onChange={(event) =>
                setValue((previous) => ({
                  ...previous,
                  limits: { ...previous.limits, [text]: event.target.value },
                }))
              }
            />
          ) : (
            <span className="limit-value">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Number(value.limits[text] ?? 0))}
            </span>
          )}
        </>
      ) : null}
    </li>
  );
}

function ApprovalToggle({ parentPermission }: { parentPermission: string }) {
  const ctx = useContext(EditorContext);
  if (!ctx) return null;
  const { editing, value, setValue } = ctx;
  const key = p2ApprovalKey(parentPermission);
  if (!value.allowed[parentPermission]) return null;
  const on = value.allowed[key] ?? false;
  const label = "Requires approval";

  return (
    <li className="permission-item permission-item-nested">
      {editing ? (
        <input
          type="checkbox"
          className="permission-checkbox"
          aria-label={`${label} for ${parentPermission}`}
          checked={on}
          onChange={(event) =>
            setValue((previous) => ({
              ...previous,
              allowed: { ...previous.allowed, [key]: event.target.checked },
            }))
          }
        />
      ) : (
        <span
          className={`permission-state-icon ${on ? "allowed" : "denied"}`}
          role="img"
          aria-label={on ? "Requires approval on" : "Requires approval off"}
          style={{
            maskImage: `url(${on ? assets.imgSuccessIcoCheckmark : assets.imgActionIcoClose})`,
          }}
        />
      )}
      <span>{label}</span>
    </li>
  );
}

const categoryDescriptions: Record<string, string> = {
  "Account Information": "Balances, statements, and account records",
  "Money movement": "Payments, transfers, and daily limits",
  "Credit cards": "Business card access",
  "Merchant services": "Payment processing for your business",
};

function PermissionCategory({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <section className="permission-category">
      <div className="category-heading">
        <span
          className="permission-category-icon"
          aria-hidden="true"
          style={{ maskImage: `url(${icon})` }}
        />
        <div>
          <h4>{title}</h4>
          <p>{categoryDescriptions[title] ?? ""}</p>
        </div>
      </div>
      <ul>{children}</ul>
    </section>
  );
}

export function ProposalTwoPermissionCategoriesEditor() {
  return (
    <section className="permission-details">
      <h3>User permissions</h3>
      <div className="permission-categories">
        <PermissionCategory title="Account Information" icon={assets.imgIcon1}>
          {P2_ACCOUNT_INFORMATION.map((text) => (
            <PermissionToggle key={text} text={text} />
          ))}
        </PermissionCategory>
        <PermissionCategory title="Money movement" icon={assets.imgIcon2}>
          {P2_MONEY_LIMIT_TYPES.map((text) => (
            <Fragment key={text}>
              <PermissionToggle text={text} limit showApproval />
              <ApprovalToggle parentPermission={text} />
            </Fragment>
          ))}
        </PermissionCategory>
        <PermissionCategory title="Credit cards" icon={assets.imgIcon4}>
          {P2_CREDIT_CARDS.map((text) => (
            <PermissionToggle key={text} text={text} />
          ))}
        </PermissionCategory>
        <PermissionCategory title="Merchant services" icon={assets.imgIcon4}>
          {P2_MERCHANT_SERVICES.map((text) => (
            <PermissionToggle key={text} text={text} />
          ))}
        </PermissionCategory>
      </div>
    </section>
  );
}

export function ProposalTwoPermissionAccountsEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) return null;
  const { editing, value, setValue, userId, companyIndex } = ctx;
  const rows = allAccountsForP2Company(companyIndex);
  return (
    <section className="permission-accounts">
      <h3>Has access to these accounts</h3>
      <ul>
        {rows.map((account) => {
          const label = formatAccountLabel(account, userId);
          const allowed = value.accounts[account.id] ?? false;
          return (
            <li key={account.id}>
              {editing ? (
                <label className="permission-option">
                  <input
                    className="permission-checkbox"
                    type="checkbox"
                    aria-label={`Access to ${label}`}
                    checked={allowed}
                    onChange={(event) =>
                      setValue((previous: Permissions) => ({
                        ...previous,
                        accounts: {
                          ...previous.accounts,
                          [account.id]: event.target.checked,
                        },
                      }))
                    }
                  />
                  {label}
                </label>
              ) : (
                <>
                  <span>{label}</span>
                  <span
                    className={`permission-state-icon ${allowed ? "allowed" : "denied"}`}
                    role="img"
                    aria-label={allowed ? "Allowed" : "Not allowed"}
                    style={{
                      maskImage: `url(${allowed ? assets.imgSuccessIcoCheckmark : assets.imgActionIcoClose})`,
                    }}
                  />
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
