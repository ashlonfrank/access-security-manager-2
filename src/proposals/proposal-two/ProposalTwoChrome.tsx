import assets from "../../assets.json";

const PRIMARY_NAV = [
  "Account",
  "Pay & transfer",
  "Collect & deposit",
  "Tools & insights",
  "Access & security",
] as const;

function Icon({ src, inverse = false }: { src: string; inverse?: boolean }) {
  return inverse ? (
    <span
      className="masked-icon"
      style={{ maskImage: `url(${src})` }}
      aria-hidden="true"
    />
  ) : (
    <img src={src} alt="" />
  );
}

/** Chase shell for Proposal 2 — nav and back bar are visual only (not wired). */
export default function ProposalTwoChrome() {
  return (
    <>
      <header>
        <div className="brand-bar">
          <div className="brand-left">
            <span className="icon-button p2-chrome-static" aria-hidden="true">
              <Icon src={assets.imgFill} inverse />
            </span>
            <img
              className="brand-logo"
              src={assets.imgGroup}
              alt="Chase for Business"
            />
          </div>
          <div className="brand-actions">
            <span className="icon-button p2-chrome-static" aria-hidden="true">
              <Icon src={assets.imgFill2} inverse />
            </span>
            <span className="sign-out p2-chrome-static" aria-hidden="true">
              Sign out
            </span>
          </div>
        </div>
        <nav className="primary-nav" aria-label="Business banking">
          {PRIMARY_NAV.map((label) => (
            <span
              key={label}
              className="p2-nav-dummy"
              aria-current={
                label === "Access & security" ? ("page" as const) : undefined
              }
            >
              {label}
            </span>
          ))}
        </nav>
      </header>
      <div className="back-bar">
        <span className="p2-back-bar-dummy" aria-hidden="true">
          <Icon src={assets.imgFill5} />
          Back
        </span>
        <div>Access &amp; Security Manager</div>
      </div>
    </>
  );
}
