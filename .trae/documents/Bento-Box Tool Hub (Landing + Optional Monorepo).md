## What You Want
- A bento-box designed landing page that showcases your daily tools.
- A clean way to launch each tool, either by embedding or by linking.
- Optionally: consolidate repos into one “tool hub” repo.

## Current Reality
- This repo currently has no app code (only Git metadata + a draft doc), so we’ll scaffold the hub from scratch.
- You already have deployed URLs:
  - PDF expert: https://traepdf-expertoute.vercel.app/
  - QR code generator: https://traeqrcodeka3i.vercel.app/
  - Image compressor: https://traeimage-compressorepwd.vercel.app/
- `pdf-expert` GitHub repo link appears unavailable (404), so we’ll treat GitHub as optional/“coming soon” for that one.

## Recommended Strategy
### Option A — Tool Hub that references deployed tools (do this first)
- Build a single bento-style hub site that:
  - Primary action: Open each tool (new tab).
  - Secondary: Optional “Preview here” that attempts to embed the tool in an iframe (modal or dedicated page).
  - Always shows a fallback “Open in new tab” because embedding may be blocked by X-Frame-Options / CSP.
- Why: fastest, lowest maintenance, and works with your existing Vercel deployments immediately.

### Option B — Monorepo consolidation (upgrade path)
- Convert this repo into a workspace and pull the tool codebases under `apps/`.
- Deploy with Vercel monorepo support (one Vercel project per app is usually the simplest).
- Why: best long-term if you want shared UI components, shared design system, and one repo to manage—but it’s more work and risk (especially for apps with serverless/API pieces like image-processor).

## Implementation Plan (What I’ll Build After You Confirm)
## 1) Scaffold the hub app
- Create a React + TypeScript + Vite app in the repo root (or under `apps/hub/` if you want to future-proof for monorepo).
- Add Tailwind CSS for bento-grid layout and theming.

## 2) Build the bento-box UI
- Add a responsive bento grid with 3 primary cards (one per tool) and optional “About/Notes” cards.
- Each Tool card includes:
  - Name, one-liner, key capabilities.
  - Buttons: Open, Preview (optional), GitHub (if available).
- Theme: dark, clean, with a subtle accent (matching the vibe of Image Processor).

## 3) Add “Preview here” embedding (safe + optional)
- Implement an iframe modal (and/or a dedicated `/:tool` route) for in-hub preview.
- Add a visible fallback message + Open-in-new-tab button.
- Use conservative iframe settings (no hacks) to avoid security issues.

## 4) Wire in your tool URLs
- Hardcode (or load from a config file) these entries:
  - PDF expert → deployed URL above
  - QR code generator → deployed URL above
  - Image compressor → deployed URL above
- Add repo links where they exist:
  - image-processor: https://github.com/ambershen/image-processor
  - qrcode-gen: https://github.com/ambershen/qrcode-gen
  - pdf-expert: placeholder until repo is available

## 5) Verify locally
- Run the dev server, confirm responsive layout, link behavior, and iframe fallback behavior.
- Ensure build passes and produces a deployable static site.

## Optional: Monorepo Upgrade Path (Later)
- Choose one consolidation method:
  - Git subtree (best if you want history inside this repo)
  - Copy/import (fastest, least Git complexity)
  - Git submodules (keeps repos independent but adds workflow overhead)
- Standardize Node version + package manager, then bring apps under `apps/` and configure Vercel per-app builds.

## Outcome
- A polished bento-box landing page that launches your tools immediately via your deployed URLs, with optional in-page preview, and a clean path to consolidate into a monorepo later.