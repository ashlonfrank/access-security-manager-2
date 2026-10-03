import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "./ProposalTwoChevrons";

export type SolidSelectOption<T extends string> = {
  value: T;
  label: string;
};

/** Solid-fill picker — same pattern as Proposal 1 role-picker / permission fields. */
export default function ProposalTwoSolidSelect<T extends string>({
  id: idProp,
  label,
  value,
  options,
  onChange,
}: {
  id?: string;
  label: string;
  value: T;
  options: SolidSelectOption<T>[];
  onChange: (next: T) => void;
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="p2-filter">
      <span id={`${id}-label`} className="p2-filter-label">
        {label}
      </span>
      <div className="role-picker p2-solid-picker" ref={root}>
        <button
          type="button"
          id={id}
          className="role-picker-trigger"
          aria-labelledby={`${id}-label`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="p2-picker-value">{selectedLabel}</span>
          <ChevronDown className="p2-picker-chevron" />
        </button>
        {open ? (
          <div className="role-picker-options" role="listbox" aria-labelledby={`${id}-label`}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`role-picker-option ${value === option.value ? "active" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
