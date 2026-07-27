# larabeauty-store

Arabic RTL storefront for **Lara Beauty** (UAE — COD gummies).

## Deploy on Vercel (main branch)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo: `BAYLA09/larabeauty-store`
3. **Production branch:** `main`
4. Framework: **Next.js** (auto-detected)
5. Root directory: `/` (leave default)
6. Click **Deploy**

After the first deploy, every push to `main` redeploys automatically.

### Environment variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | Google Apps Script web app URL that appends orders to your sheet (**Vercel**, server-side) |
| `SHEETS_WEBHOOK_SECRET` | Shared secret checked by the Apps Script (`lara-beauty-secret-2026`) |
| `GOOGLE_SHEET_ID` | Spreadsheet ID (for Apps Script setup): `1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU` |
| `NEXT_PUBLIC_API_URL` | Optional external backend for orders (overrides `/api/orders`) |
| `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` | Optional client-side webhook fallback for static GitHub Pages deploys |
| `NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET` | Secret for the client-side fallback above |

**Vercel setup:** Project → Settings → Environment Variables:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbya-nPjvwkxal4q1b7GA8pjTuP0dI1s0uw6L27_nrbIxUyEsMTn1xWNS-kVt8fRGqzuBw/exec
SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026
```

Then redeploy.

Orders are sent to `/api/orders` on Vercel, which forwards them to Google Sheets without exposing the secret in the browser.

**Google Sheet:** [Lara Beauty orders](https://docs.google.com/spreadsheets/d/1n_vZl2t3X_KV0Rkpj6dR9TZRRm3OETv3IjIdzcH-diU/edit)

### Apps Script setup

1. Open the sheet → **Extensions → Apps Script**
2. Replace the code with [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Use the `/exec` URL in Vercel (not the `/u/1/` browser link)

Deployment ID: `AKfycbya-nPjvwkxal4q1b7GA8pjTuP0dI1s0uw6L27_nrbIxUyEsMTn1xWNS-kVt8fRGqzuBw`

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
