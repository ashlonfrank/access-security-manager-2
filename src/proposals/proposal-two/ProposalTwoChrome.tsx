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

/** Chase brand bar only — Proposal 2 (no primary nav or ASM back bar). */
export default function ProposalTwoChrome() {
  return (
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
    </header>
  );
}
