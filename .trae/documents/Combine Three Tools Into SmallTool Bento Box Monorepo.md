## Decisions (Locked In)
- Monorepo structure: `apps/*` for apps + `packages/*` for shared code.
- Workspace tool: **npm workspaces** (this repo already uses npm + package-lock).
- Hub location: **`apps/hub` is the single canonical hub app** (the root becomes workspace-only).
- Import method (your “let’s do this”): **Hybrid**
  - `qrcode-gen` + `image-processor` → **git subtree** from GitHub (history preserved)
  - `pdf-expert` → **manual import** for now (repo link currently uncertain), can subtree later

## Target Layout
- `apps/hub`
- `apps/pdf-expert`
- `apps/qrcode-gen`
- `apps/image-compressor`
- `packages/ui`
- `packages/config` (optional)

## Implementation Steps
### 1) Create workspace root
- Convert root `package.json` into a workspace root:
  - Add `workspaces: ["apps/*", "packages/*"]`
  - Add root scripts to run app scripts via workspaces (dev/build/lint)
  - Keep root `private: true`

### 2) Consolidate hub into `apps/hub`
- Move the current root hub (Tailwind + framer-motion + lucide, etc.) into `apps/hub`.
- Remove/replace the existing `apps/hub` starter so there’s only one hub.
- Ensure `apps/hub` runs with the same UI/behavior as today.

### 3) Add shared UI package
- Create `packages/ui` and move shared components (ToolCard, grid primitives, buttons).
- Update hub to consume `@smalltool/ui` via workspace dependency.

### 4) Import tool apps
- `apps/qrcode-gen`: pull in via git subtree; ensure it installs/builds under workspace.
- `apps/image-compressor`: pull in via git subtree; ensure it installs/builds under workspace.
- `apps/pdf-expert`: copy in source; normalize scripts/config so it behaves like other apps.

### 5) Normalize tooling across apps
- Align TypeScript settings across apps (shared base tsconfig).
- Align ESLint (shared config optional; at minimum make rules consistent).
- Align Tailwind config if those apps use Tailwind.

### 6) Hub integration
- Create a single “tool registry” config consumed by the hub:
  - name, description, deployed URL, repo URL, local route
- Hub buttons:
  - Open deployed URL (always works)
  - Optional “Preview here” via iframe with explicit fallback

### 7) Verification
- One root install works.
- Build all workspaces successfully.
- Each app dev server runs.
- Hub links launch the correct tool deployments.

## Deployment (Vercel)
- One Vercel project per app, Root Directory set to each `apps/*`.

## What I’ll Execute Immediately After Plan Confirmation
- Apply workspace conversion + hub consolidation.
- Add `packages/ui`.
- Import `qrcode-gen` + `image-processor` via subtree and wire them.
- Import `pdf-expert` manually and normalize.
- Run builds to confirm everything works.