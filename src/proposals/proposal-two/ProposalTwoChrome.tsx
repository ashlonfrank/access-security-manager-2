import assets from "../../assets.json";

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

/** Same chrome as Proposal 1 — do not diverge from proposal-one shell. */
export default function ProposalTwoChrome() {
  return (
    <>
      <header>
        <div className="brand-bar">
          <div className="brand-left">
            <button className="icon-button" aria-label="Open navigation menu" type="button">
              <Icon src={assets.imgFill} inverse />
            </button>
            <img
              className="brand-logo"
              src={assets.imgGroup}
              alt="Chase for Business"
            />
          </div>
          <div className="brand-actions">
            <button className="icon-button" aria-label="Help" type="button">
              <Icon src={assets.imgFill2} inverse />
            </button>
            <button className="sign-out" type="button">
              Sign out
            </button>
          </div>
        </div>
        <nav className="primary-nav" aria-label="Business banking">
          <button type="button" aria-current="page">
            Access &amp; security
          </button>
        </nav>
      </header>
      <div className="back-bar">
        <button
          type="button"
          onClick={() => {
            window.location.assign(window.location.pathname);
          }}
        >
          <Icon src={assets.imgFill5} />
          Baseline app
        </button>
        <div>Access &amp; Security Manager</div>
      </div>
    </>
  );
}
