# Proposals

This repository uses **git branches** for each Figma option.

## Proposal 2 (`proposal-2` branch)

- **App:** `proposal-two/` (`ProposalTwoApp.tsx`, `proposal-two.css`, …)
- **Preview:** run `npm run dev` and open **http://127.0.0.1:43123/**
- **Shared modules** (demo accounts, permissions UI, tokens) live under `src/` and are imported by Proposal 2.

Build and iterate on **Proposal 2 in the `proposal-2` branch** and this agent; baseline and Proposal 1 are on other branches.

## Other branches

- **`main`** — baseline Access & Security Manager
- **`proposal-1`** — Figma option 1 shell

Do not add Proposal 2–specific UI outside `src/proposals/proposal-two/` on this branch.
