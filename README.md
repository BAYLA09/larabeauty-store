# larabeauty-store

Arabic RTL storefront for **Lara Beauty** (UAE — COD gummies).

## Deploy (Vercel — recommended)

Site dyalek `larabeauty.store` khassu y-deploy f **Vercel**, machi GitHub Pages.

### Step 1 — Connect Vercel

1. Sir l [vercel.com/new](https://vercel.com/new)
2. **Import** repo: `BAYLA09/larabeauty-store`
3. Framework: **Next.js** (auto-detected)
4. **Deploy** (first deploy)

### Step 2 — Environment variables

F Vercel → Project → **Settings → Environment Variables**, zid:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/u/1/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
NEXT_PUBLIC_SITE_URL=https://larabeauty.store
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
```

3. **Redeploy** (Deployments → ... → Redeploy)

### Step 3 — Custom domain

1. Vercel → Project → **Settings → Domains**
2. Zid `larabeauty.store` w `www.larabeauty.store`
3. Dir DNS records li kay3tik Vercel f registrar dyalek

---

## GitHub Pages (optional — not active yet)

GitHub Actions build kaynajح, walakin **Pages ma activéch** f repo. Ila bghiti GitHub Pages:

1. Sir l [github.com/BAYLA09/larabeauty-store/settings/pages](https://github.com/BAYLA09/larabeauty-store/settings/pages)
2. **Source** → **GitHub Actions**
3. Re-run workflow: Actions → Deploy to GitHub Pages → Run workflow

Site ghadi ykon f `https://bayla09.github.io/larabeauty-store/` (machi larabeauty.store).

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
