import assets from "../../assets.json";

/** 16×16 row chevron — same asset as baseline / Proposal 1 user list. */
export function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <img
      className={`p2-chevron-icon ${className}`.trim()}
      src={assets.imgIcon}
      alt=""
      width={16}
      height={16}
    />
  );
}

/** 16×16 back chevron — navigation affordance on details header. */
export function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <img
      className={`p2-chevron-icon ${className}`.trim()}
      src={assets.imgNavigationIcoChevronLeft}
      alt=""
      width={16}
      height={16}
    />
  );
}

/** 16×16 dropdown chevron — same as baseline filter / control affordances. */
export function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <img
      className={`p2-chevron-icon ${className}`.trim()}
      src={assets.imgMask}
      alt=""
      width={16}
      height={16}
    />
  );
}
