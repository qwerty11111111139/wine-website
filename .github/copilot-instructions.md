# Copilot instructions for Dionysus Cellar (static site + minimal PHP auth)

Purpose: quick, actionable guidance for an AI coding agent to become productive in this repository.

## Quick summary
- Multi-page static site (HTML/CSS/vanilla JS) + a minimal PHP endpoint (`api.php`) that implements user auth and session checks.
- No build system or test suite found — files are served directly; images live in `img1/`.

## Key files & where to look
- Pages: `index.html`, `wine.html`, `about.html`, `cabinet*.html` (UI per page; page-specific CSS files in the root).
- Frontend JS: `index(script1).js` (site-wide interactions & notifications), `wine(script).js` (wine data and modal behavior), `about.js`.
- Backend: `api.php` (routes: `action=register|login|logout|check_session`, expects JSON POST for register/login).
- Assets: `img1/` (images used by product cards and modals).

## How to run locally (developer workflow)
- Static-only testing: open `index.html` in a browser or use a static server (VSCode Live Server) to avoid file:// issues.
- When backend is needed (auth endpoints): run PHP and MySQL.
  - Quick local server (requires PHP): from project root run `php -S localhost:8000` and visit `http://localhost:8000/`.
  - Quick DB check: after starting the PHP server visit `http://localhost:8000/db_test.php` (or `curl http://localhost:8000/db_test.php`). The script returns JSON and will attempt to create the `users` table if it does not exist. If your MySQL runs on a non-standard port (for example `3307`), you can pass it as a query parameter: `http://localhost:8000/db_test.php?port=3307` or set the `DB_PORT` environment variable.
  - For database-backed flows use XAMPP/WAMP/MAMP or MySQL server. `api.php` expects a DB named `dionysus_cellar` and connects using credentials in the file (`root` / empty password by default). If your DB uses a custom port, set `DB_PORT` in the environment (e.g., `DB_PORT=3307`).
- Example register request (replace host/port):
  curl -X POST -H "Content-Type: application/json" \
    'http://localhost:3307/api.php?action=register' \
    -d '{"name":"Test","email":"a@b.c","phone":"123","password":"secret","password_confirm":"secret"}'

## Important patterns and conventions (do not change lightly)
- Data attributes are primary integration points:
  - `data-modal` (opens modal with id `modal-<name>`), `data-region` (opens `modal-<region>`), `data-filter` (product filters), `data-category` on `.product-card` (filtering), `data-image` used in galleries.
  - Modal id conventions: region modals use `modal-<region>` (e.g. `modal-tuscany`), wine modals use numeric ids like `modal-1`. Avoid id collisions when adding new modals.
- Local persistence: favorites are stored as JSON in `localStorage` under the key `wineFavorites` (array of objects `{id,name,img}`);
  update/inspect with `localStorage.getItem('wineFavorites')`.
- JS style: plain vanilla JS, DOMContentLoaded hooks, small helper functions (`showNotification` in `index(script1).js`), IntersectionObserver for scroll animations. Keep behavior consistent with existing files.
- File naming: many filenames include spaces and parentheses (e.g. `index(script1).js`, `index(style1).css`, `cabinet products.html`). Use quoted paths when scripting or running commands to avoid shell issues.

## Common edits & examples
- Add a new wine entry:
  1. Add data to `wineData` in `wine(script).js` (key = numeric id).
  2. Add a corresponding modal block in `wine.html` with `id="modal-<id>"` and expected structure (image, .modal-info, .like-btn data attributes).
  3. Place the image in `img1/` and update the wine card in the grid if needed.

- Wire a new auth flow (client -> server): frontends currently validate forms client-side and show simulated responses; to add real auth use `fetch('/api.php?action=login', {method:'POST', body: JSON.stringify({email, password}), headers:{'Content-Type':'application/json'}})` and handle JSON responses.

## Observations / gotchas
- There are no automated tests or CI configuration present — agent should not assume test harnesses exist.
- Some client flows are simulated (newsletter, invite, purchase) — check whether the intended behavior should call `api.php` or remain client-only.
- Watch for inconsistent naming and duplicate modal id patterns (region vs numeric wine modals) — collisions cause subtle bugs.

## Debugging tips
- Use browser DevTools (Console & Network) and `localStorage` inspection for client-side issues.
- API issues: check PHP server logs and ensure MySQL is running and the `dionysus_cellar` DB exists; `api.php` auto-creates the `users` table but expects a DB.

---
If you'd like, I can (a) add quick unit/e2e scaffolding, (b) convert filenames to safer names and update references, or (c) add a short CONTRIBUTING.md describing dev setup; tell me which you'd prefer next.