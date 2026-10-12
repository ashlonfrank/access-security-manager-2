import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";
import "@fontsource/open-sans/600.css";
import ProposalTwoApp from "./proposals/proposal-two/ProposalTwoApp";
import "./styles.css";
import "./refinements.css";

/** Proposal 2 branch: root URL loads Proposal 2 only (no prototype query). */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProposalTwoApp />
  </React.StrictMode>,
);
