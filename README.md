# larabeauty-store

Arabic RTL storefront for **Lara Beauty** (UAE — COD gummies).

## Deploy — 1 click w kolchi khddam

### Option A: GitHub Pages (auto — kol push)

**Wa7ed lمرة b ydek:**

1. Sir l https://github.com/BAYLA09/larabeauty-store/settings/pages
2. **Source** → **Deploy from a branch**
3. Branch: **gh-pages** → Folder: **/ (root)** → Save

Mn ba3d, kol push l `main` kay-deploy automatiquement (~1 min).

**DNS** (f registrar dyalek):
- `larabeauty.store` → A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www` → CNAME → `bayla09.github.io`

### Option B: Vercel (2 min)

1. https://vercel.com/new → Import `BAYLA09/larabeauty-store`
2. Deploy → Settings → Domains → `larabeauty.store`
3. Env vars (Settings → Environment Variables):

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/u/1/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
```

### Option C: Netlify

1. https://app.netlify.com → Import `BAYLA09/larabeauty-store`
2. `netlify.toml` kay-configuri kolchi automatiquement

---

**Ma kaynch backend msepar** — Google Sheets webhook howa backend. Orders kaymشيو direct mn site.

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
npm start
```
