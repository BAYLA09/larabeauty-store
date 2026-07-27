FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_PUBLIC_SITE_URL=https://larabeauty.store
ENV NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxmRpjD1uGAfwWMzPbmKvA47kKygi1i6RQSD7R6dck6MiwI036ZYe8jG3HtOI_uFPZBIw/exec
ENV NEXT_PUBLIC_SHEETS_WEBHOOK_SECRET=lara-beauty-secret-2026

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
