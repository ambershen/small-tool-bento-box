# SmallTool Bento Box (Monorepo)

A single repo containing the bento-box hub plus three tools (QR Code Gen, PDF Expert, Image Compressor).

## Structure

- `.trae/skills` — Trae skills imported from sub-apps
- `apps/hub` — the landing page hub (bento grid)
- `apps/qrcode-gen` — QR code generator app
- `apps/pdf-expert` — PDF utilities app (includes `api/` for Vercel functions)
- `apps/image-compressor` — image compression app (includes `api/` for Vercel functions)
- `packages/ui` — shared UI components consumed by the hub

## Local Development

```bash
npm install
npm run dev
```

Run a specific app:

```bash
npm run dev -w @smalltool/qrcode-gen
npm run dev -w @smalltool/pdf-expert
npm run dev -w @smalltool/image-compressor
```

## Checks

```bash
npm run build
npm run lint
```

## Deploying on Vercel (One Project Per App)

Create a separate Vercel project for each app and set:

- Root Directory:
  - Hub: `apps/hub`
  - QR Code Gen: `apps/qrcode-gen`
  - PDF Expert: `apps/pdf-expert`
  - Image Compressor: `apps/image-compressor`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

`apps/hub` depends on `packages/ui` via a local file reference, so keep the repo layout intact in Vercel.
