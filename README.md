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

### Environment variables (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL for order submission (e.g. your API). If empty, orders still redirect to `/thank-you` without API call. |

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
