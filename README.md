# larabeauty-store

Arabic RTL storefront for **Lara Beauty** (UAE — COD gummies).

## Deploy — ma bghiti Easypanel? (2 dakika)

Site dyalek **static** — ma kayhtajch VPS wla Easypanel. Kol push l `main` kay-build automatiquement.

### Option 1: GitHub Pages (recommandé — gratuit, auto)

**Wa7ed lمرة (2 clics):**

1. Sir l https://github.com/BAYLA09/larabeauty-store/settings/pages
2. **Build and deployment** → Source: **GitHub Actions** → Save

**DNS** (f registrar dyalek — Namecheap, GoDaddy, etc.):

- **Supprimer** A record li kaypointi l `187.124.12.89` (VPS/Easypanel)
- **Zid** had A records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www` → CNAME → `bayla09.github.io`

Mn ba3d ~5-30 min, `larabeauty.store` ghadi ykhdem b l-build jdid automatiquement.

### Option 2: Netlify (sahl bzaf)

1. Sir l https://app.netlify.com → **Add new site** → **Import from Git** → `BAYLA09/larabeauty-store`
2. Deploy (kaykhdem automatiquement)
3. **Domain settings** → zid `larabeauty.store`
4. Beddel DNS 3la hsab instructions dyal Netlify

**Auto-deploy mn GitHub Actions (optional):** zid secrets `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` f GitHub.

### Option 3: Vercel

1. https://vercel.com/new → Import `BAYLA09/larabeauty-store`
2. Deploy → Settings → Domains → `larabeauty.store`
3. Env vars:

```
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
```

### Easypanel (ikhtiyari — ila bghiti tb9a 3lih)

Ila bghiti tb9a 3la Easypanel/VPS:

1. **Build** tab → method: **Dockerfile** (mach Nixpacks)
2. **Domains** → port container: **80**
3. **Deploy** → ila kayfail, chouf logs

Walakin **GitHub Pages wla Netlify ashel** — ma kayhtajch server.

---

**Ma kaynch backend** — Google Sheets webhook howa backend. Orders kaymشيو direct mn site.

---

## Google Sheets orders

Orders are written to sheet tab **Tabellenblatt1**:
`date | order id | country | name | phone | product | url | sku | quantite | totalprice | currency`

**Google Sheet:** [Lara Beauty orders](https://docs.google.com/spreadsheets/d/1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU/edit)

### Apps Script setup

1. Open the sheet → **Extensions → Apps Script**
2. Replace the code with [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
3. **Deploy → New deployment → Web app** (Execute as: Me, Anyone can access)

Deployment ID: `AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw`

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

Static files f dossier `out/`.
