type ChevronProps = { className?: string };

const svgBase = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
};

/** 16×16 row chevron — stroke (inset so legs aren’t clipped at viewBox edge). */
export function ChevronRight({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
      overflow="visible"
    >
      <path
        d="M5.25 3.75 10.5 8 5.25 12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** 16×16 back chevron — stroke (matches row chevrons; even leg weight). */
export function ChevronLeft({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
      overflow="visible"
    >
      <path
        d="M10.75 3.75 5.5 8 10.75 12.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Heavier down chevron for Manage Users / Companies scope (stroke, reads bolder at title size). */
export function ChevronDownBold({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
    >
      <path
        d="M3.5 6.25 8 10.75 12.5 6.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** 16×16 dropdown chevron — inline SVG (controls / Edit). */
export function ChevronDown({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
    >
      <path
        d="M3.64 5.75a.75.75 0 0 1 1.06 0L8 9.05l3.3-3.3a.75.75 0 1 1 1.06 1.06l-3.83 3.83a.75.75 0 0 1-1.06 0L3.64 6.81a.75.75 0 0 1 0-1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 16×16 collapse chevron — inline SVG (Show less). */
export function ChevronUp({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
    >
      <path
        d="M12.36 10.25a.75.75 0 0 1-1.06 0L8 6.95l-3.3 3.3a.75.75 0 1 1-1.06-1.06l3.83-3.83a.75.75 0 0 1 1.06 0l3.83 3.83a.75.75 0 0 1 0 1.06Z"
        fill="currentColor"
      />
    </svg>
  );
}
