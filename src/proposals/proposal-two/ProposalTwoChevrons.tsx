type ChevronProps = { className?: string };

const svgBase = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
};

/** 16×16 row chevron — inline SVG (same geometry as baseline list). */
export function ChevronRight({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
    >
      <path
        d="M5.28 14.65a.75.75 0 0 1-.53-1.28L10.03 8 4.75 2.63a.75.75 0 1 1 1.06-1.06l6.22 5.66a.75.75 0 0 1 0 1.06L5.81 14.6a.75.75 0 0 1-.53.05Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 16×16 back chevron — inline SVG (navigation). */
export function ChevronLeft({ className = "" }: ChevronProps) {
  return (
    <svg
      {...svgBase}
      className={`p2-chevron-icon ${className}`.trim()}
    >
      <path
        d="M10.72 14.65a.75.75 0 0 0 .53-1.28L5.97 8l5.28-5.37a.75.75 0 1 0-1.06-1.06L4.19 6.94a.75.75 0 0 0 0 1.06l5.99 5.45a.75.75 0 0 0 .54.2Z"
        fill="currentColor"
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
        strokeWidth="1"
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
