# larabeauty-store

Arabic RTL storefront for **Lara Beauty** (UAE — COD gummies).

## Deploy Easypanel — `laragccfrontend` / `frontend` (repo mkhabbi)

Easypanel kaypull: **`lara-beauty-store-gcc/laragccfrontend`** / **`frontend`** / port **3000**

Code jdid f `BAYLA09/larabeauty-store` — **khass push l laragccfrontend**.

---

### ⚡ ONE-CLICK FIX (2 min)

**1)** Generi token: https://github.com/settings/tokens/new?scopes=repo&description=laragcc-sync

**2)** Sir l: https://github.com/BAYLA09/larabeauty-store/actions/workflows/easypanel-deploy-fix.yml

**3)** **Run workflow** → paste token → Run

**4)** Easypanel → frontend → **Deploy** (ila ma triggerach auto)

**Khlas.** Kolchi ghadi ytsync.

---

### Auto kol push (optional, ba3d first fix)

Zid secret `LARAGCC_DEPLOY_KEY` — chouf section lta7t.

---

### Easypanel settings (deja configuré)

| Setting | Value |
|---------|--------|
| Dockerfile | `Dockerfile` |
| Proxy port | **3000** |
| Health check | `/api/health` |

---

## Deploy — bla Easypanel (GitHub Pages)

Site dyalek **static** — ma kayhtajch VPS wla Easypanel. Kol push l `main` kay-build automatiquement.

### Easypanel — deploy **frontend** (mach backend!)

F screenshot dyalek, 3andek 3 services: `backend`, `database`, `frontend`.

- **backend** = API Express (repo akhor) — kaydeploy mzyan ✅
- **frontend** = site `larabeauty.store` — **hada li khassou y-deploy** ⚠️

#### Steps f Easypanel (frontend service):

1. F sidebar, clique **frontend** (mach backend!)
2. **Source** → GitHub → repo: `BAYLA09/larabeauty-store` → branch: **`frontend`**
3. **Build** → method: **Dockerfile** (mach Nixpacks!) → port **3000**
5. **Deployments** → clique **Deploy**

#### Auto-deploy (kol push):

1. F **frontend** → **Deployments** → copier **Deployment Trigger URL**
   - `http://187.124.12.89:3000/api/deploy/XXXXXXXX`
2. GitHub → Settings → Secrets → `EASYPANEL_DEPLOY_TOKEN` = token `XXXXXXXX`
3. Wla activi **Auto Deploy** f Easypanel (kayzid webhook f GitHub)

> **Note:** `backend` w `frontend` services mseparin. Backend kaydeploy ma kaybeddelch site — frontend howa li kayserve `larabeauty.store`.

### Option 1: GitHub Pages (bla Easypanel — ashel)

**Wa7ed lمرة (2 clics):**

1. Sir l https://github.com/BAYLA09/larabeauty-store/settings/pages
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **gh-pages** → Folder: **/ (root)** → **Save**

> Kol push l `main` kay-update `gh-pages` automatiquement. Ma khasskch t-deploy yedk.

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

Chouf section **Easypanel — deploy frontend** l fo9.

Walakin **GitHub Pages wla Netlify ashel** — ma kayhtajch server.

---

**Ma kayhtajch backend API** bach orders — Google Sheets webhook howa backend. Orders kaymشيو direct mn site. Service `backend` f Easypanel ikhtiyari.

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
