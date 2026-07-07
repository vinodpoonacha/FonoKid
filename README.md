# Fono — phonics reading game (PWA)

An installable, offline-capable reading game. Original content; not affiliated with any other app.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload **all** of these files to the repository root (same folder, not a subfolder):
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
   - `icon-maskable-512.png`
   - `apple-touch-icon.png`
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose your main branch and the **/(root)** folder, then **Save**.
5. Wait ~1 minute. Your app is live at `https://<your-username>.github.io/<repo-name>/`.

All paths are relative, so it works no matter what the repo is named.

## Installing on a device

Open the Pages URL in a mobile browser, then:
- **Android / Chrome:** tap the menu → **Install app** (or **Add to Home screen**).
- **iPhone / Safari:** tap **Share** → **Add to Home Screen**.

After the first online visit, the app works **offline** — the service worker caches everything.

## Updating to a new version

When you upload a new `index.html`, users get it automatically the next time they open the app **online** (the service worker fetches HTML network-first). If you change other files, also bump `CACHE_VERSION` inside `sw.js` (e.g. `fono-v2.0.0` → `fono-v2.0.1`) so old caches are cleared. The on-screen version stamp (bottom of the welcome and map screens) lets you confirm which build is live.

## Files

- `index.html` — the whole app (HTML, CSS, JS in one file)
- `manifest.webmanifest` — PWA metadata (name, icons, colors)
- `sw.js` — service worker (offline caching; HTML is network-first so updates show fast)
- `icon-*.png`, `apple-touch-icon.png` — app icons

## Note on privacy / storage

Progress (the monster, stars, stage) is saved locally in the browser via `localStorage`. It is per-device and per-browser; nothing is uploaded anywhere.
